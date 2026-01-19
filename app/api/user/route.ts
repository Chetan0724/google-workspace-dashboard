import { NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user, error } = await supabaseServer
      .from("users")
      .select("id, email, name, avatar_url, google_id, created_at, updated_at")
      .eq("id", session.userId)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
