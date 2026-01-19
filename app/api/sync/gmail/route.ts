import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";
import {
  refreshAccessToken,
  fetchGmailMessages,
  fetchGmailMessageDetails,
} from "@/lib/google";
import { GmailMessageDetail } from "@/lib/types";

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
      .select("gmail_sync_status")
      .eq("user_id", session.userId)
      .single();

    if (syncState?.gmail_sync_status === "syncing") {
      return NextResponse.json({ message: "Sync already in progress" });
    }

    await supabaseServer
      .from("sync_state")
      .update({ gmail_sync_status: "syncing" })
      .eq("user_id", session.userId);

    const tokens = await refreshAccessToken(user.google_refresh_token);
    const messagesList = await fetchGmailMessages(tokens.access_token, 500);
    const messages = messagesList.messages || [];

    const emailsToInsert = [];

    for (const message of messages.slice(0, 500)) {
      try {
        const details: GmailMessageDetail = await fetchGmailMessageDetails(
          tokens.access_token,
          message.id
        );

        const headers = details.payload.headers;
        const from = headers.find((h) => h.name === "From")?.value || "";
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        const senderMatch = from.match(/^(.+?)\s*<(.+?)>$/);
        const senderName = senderMatch
          ? senderMatch[1].trim().replace(/"/g, "")
          : from;
        const senderEmail = senderMatch ? senderMatch[2].trim() : from;

        emailsToInsert.push({
          user_id: session.userId,
          message_id: details.id,
          thread_id: details.threadId,
          subject: subject || "(No subject)",
          sender_name: senderName,
          sender_email: senderEmail,
          snippet: details.snippet || "",
          labels: details.labelIds || [],
          received_at: new Date(date).toISOString(),
          is_read: !details.labelIds?.includes("UNREAD"),
          is_starred: details.labelIds?.includes("STARRED") || false,
          has_attachments:
            details.payload.parts?.some((p) => p.filename) || false,
        });
      } catch (err) {
        console.error(`Error fetching message ${message.id}:`, err);
      }
    }

    if (emailsToInsert.length > 0) {
      await supabaseServer.from("gmail_messages").upsert(emailsToInsert, {
        onConflict: "user_id,message_id",
        ignoreDuplicates: false,
      });
    }

    await supabaseServer
      .from("sync_state")
      .update({
        gmail_sync_status: "idle",
        gmail_last_sync_at: new Date().toISOString(),
      })
      .eq("user_id", session.userId);

    return NextResponse.json({ success: true, count: emailsToInsert.length });
  } catch (error) {
    console.error("Gmail sync error:", error);

    const session = await getSession();
    if (session) {
      await supabaseServer
        .from("sync_state")
        .update({
          gmail_sync_status: "error",
          gmail_error_message:
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
