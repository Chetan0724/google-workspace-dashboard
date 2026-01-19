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
    const filter = searchParams.get("filter") || "inbox";
    const search = searchParams.get("search") || "";

    let query = supabaseServer
      .from("gmail_messages")
      .select("*")
      .eq("user_id", session.userId)
      .order("received_at", { ascending: false });

    if (filter === "starred") {
      query = query.eq("is_starred", true);
    } else if (filter === "sent") {
      query = query.contains("labels", ["SENT"]);
    } else if (filter === "social") {
      query = query.contains("labels", ["CATEGORY_SOCIAL"]);
    } else if (filter === "promotions") {
      query = query.contains("labels", ["CATEGORY_PROMOTIONS"]);
    } else if (filter === "inbox") {
      query = query.contains("labels", ["INBOX"]);
    }

    const { data: emails, error } = await query.limit(1000);

    if (error) {
      throw error;
    }

    let filteredEmails = emails || [];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredEmails = filteredEmails.filter(
        (email) =>
          email.subject?.toLowerCase().includes(searchLower) ||
          email.sender_name?.toLowerCase().includes(searchLower) ||
          email.sender_email?.toLowerCase().includes(searchLower) ||
          email.snippet?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ emails: filteredEmails });
  } catch (error) {
    console.error("Fetch emails error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
