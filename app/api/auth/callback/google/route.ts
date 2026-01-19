import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleUserInfo } from "@/lib/google";
import { createSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error) {
    console.error("OAuth error from Google:", error);
    return NextResponse.redirect(`${baseUrl}/?error=oauth_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      console.error("No refresh token received");
      return NextResponse.redirect(`${baseUrl}/?error=no_refresh_token`);
    }

    const googleUser = await getGoogleUserInfo(tokens.access_token);

    const { data: user, error: dbError } = await supabaseServer
      .from("users")
      .upsert(
        {
          email: googleUser.email,
          name: googleUser.name,
          avatar_url: googleUser.picture,
          google_id: googleUser.id,
          google_refresh_token: tokens.refresh_token,
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save user: ${dbError.message}`);
    }

    if (!user) {
      throw new Error("User creation/update failed");
    }

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);

    await createSession(response, {
      userId: user.id,
      email: user.email,
    });

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${baseUrl}/?error=callback_failed`);
  }
}
