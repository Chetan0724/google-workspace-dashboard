import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const now = new Date();

    const { data: events, error } = await supabaseServer
      .from("calendar_events")
      .select("*")
      .eq("user_id", session.userId)
      .gte("start_time", now.toISOString())
      .order("start_time", { ascending: true })
      .limit(500);

    if (error) {
      throw error;
    }

    let filteredEvents = events || [];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(
        (event) =>
          event.summary?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ events: filteredEvents });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
