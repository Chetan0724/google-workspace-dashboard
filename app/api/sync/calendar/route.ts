import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";
import { refreshAccessToken, fetchCalendarEvents } from "@/lib/google";
import { GoogleCalendarEvent } from "@/lib/types";

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabaseServer
      .from("users")
      .select("google_refresh_token")
      .eq("id", session.userId)
      .single();

    if (!user?.google_refresh_token) {
      return NextResponse.json({ error: "No refresh token" }, { status: 400 });
    }

    const { data: syncState } = await supabaseServer
      .from("sync_state")
      .select("calendar_sync_status")
      .eq("user_id", session.userId)
      .single();

    if (syncState?.calendar_sync_status === "syncing") {
      return NextResponse.json({ message: "Sync already in progress" });
    }

    await supabaseServer
      .from("sync_state")
      .update({ calendar_sync_status: "syncing" })
      .eq("user_id", session.userId);

    const tokens = await refreshAccessToken(user.google_refresh_token);
    const eventsData = await fetchCalendarEvents(tokens.access_token);
    const events: GoogleCalendarEvent[] = eventsData.items || [];

    const eventsToInsert = events.map((event) => {
      const startTime = event.start.dateTime || event.start.date;
      const endTime = event.end.dateTime || event.end.date;
      const isAllDay = !event.start.dateTime;

      const attendees = (event.attendees || []).map((att) => ({
        email: att.email,
        displayName: att.displayName,
        responseStatus: att.responseStatus,
        organizer: att.organizer || false,
        self: att.self || false,
      }));

      const meetingLink =
        event.hangoutLink || extractMeetingLink(event.description || null);

      return {
        user_id: session.userId,
        event_id: event.id,
        calendar_id: "primary",
        summary: event.summary || "Untitled Event",
        description: event.description || null,
        location: event.location || null,
        start_time: new Date(startTime!).toISOString(),
        end_time: new Date(endTime!).toISOString(),
        meeting_link: meetingLink,
        attendees,
        is_all_day: isAllDay,
        status: event.status || "confirmed",
      };
    });

    if (eventsToInsert.length > 0) {
      await supabaseServer.from("calendar_events").upsert(eventsToInsert, {
        onConflict: "user_id,event_id",
        ignoreDuplicates: false,
      });
    }

    await supabaseServer
      .from("sync_state")
      .update({
        calendar_sync_status: "idle",
        calendar_last_sync_at: new Date().toISOString(),
      })
      .eq("user_id", session.userId);

    return NextResponse.json({ success: true, count: eventsToInsert.length });
  } catch (error) {
    console.error("Calendar sync error:", error);

    const session = await getSession();
    if (session) {
      await supabaseServer
        .from("sync_state")
        .update({
          calendar_sync_status: "error",
          calendar_error_message:
            error instanceof Error ? error.message : "Unknown error",
        })
        .eq("user_id", session.userId);
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function extractMeetingLink(description: string | null): string | null {
  if (!description) return null;

  const meetRegex = /https:\/\/meet\.google\.com\/[a-z-]+/i;
  const zoomRegex = /https:\/\/[a-z0-9.-]*zoom\.us\/j\/\d+/i;
  const teamsRegex = /https:\/\/teams\.microsoft\.com\/l\/meetup-join\/[^\s]+/i;

  const meetMatch = description.match(meetRegex);
  if (meetMatch) return meetMatch[0];

  const zoomMatch = description.match(zoomRegex);
  if (zoomMatch) return zoomMatch[0];

  const teamsMatch = description.match(teamsRegex);
  if (teamsMatch) return teamsMatch[0];

  return null;
}
