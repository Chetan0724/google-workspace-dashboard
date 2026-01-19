import { NextResponse } from "next/server";
import { getGoogleAuthURL } from "@/lib/google";

export async function GET() {
  try {
    const authURL = getGoogleAuthURL();
    return NextResponse.redirect(authURL);
  } catch (error) {
    console.error("Error initiating OAuth:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=oauth_init_failed`
    );
  }
}
