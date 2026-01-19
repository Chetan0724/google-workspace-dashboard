import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/jwt";
import { supabaseServer } from "@/utils/supabase/server";
import { refreshAccessToken, fetchGmailMessageDetails } from "@/lib/google";
import { GmailMessageDetail } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
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

    const tokens = await refreshAccessToken(user.google_refresh_token);
    const messageDetails: GmailMessageDetail = await fetchGmailMessageDetails(
      tokens.access_token,
      params.messageId
    );

    const headers = messageDetails.payload.headers;
    const from = headers.find((h) => h.name === "From")?.value || "";
    const subject = headers.find((h) => h.name === "Subject")?.value || "";
    const date = headers.find((h) => h.name === "Date")?.value || "";

    const senderMatch = from.match(/^(.+?)\s*<(.+?)>$/);
    const senderName = senderMatch
      ? senderMatch[1].trim().replace(/"/g, "")
      : from;
    const senderEmail = senderMatch ? senderMatch[2].trim() : from;

    const body = extractEmailBody(messageDetails);

    const emailData = {
      subject: subject || "(No subject)",
      from: senderName,
      email: senderEmail,
      date: new Date(date),
      body: body,
      avatar: getInitials(senderName),
    };

    return NextResponse.json({ email: emailData });
  } catch (error) {
    console.error("Fetch email detail error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

interface GmailMessagePart {
  mimeType?: string;
  body?: {
    data?: string;
  };
  parts?: GmailMessagePart[];
}

function extractEmailBody(message: GmailMessageDetail): string {
  const parts = (message.payload.parts as GmailMessagePart[]) || [];

  let htmlBody = "";
  let textBody = "";

  function findParts(parts: GmailMessagePart[]): void {
    for (const part of parts) {
      if (part.mimeType === "text/html" && part.body?.data) {
        htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
      } else if (part.mimeType === "text/plain" && part.body?.data) {
        textBody = Buffer.from(part.body.data, "base64").toString("utf-8");
      }

      if (part.parts) {
        findParts(part.parts);
      }
    }
  }

  const payload = message.payload as GmailMessagePart;

  if (payload.body?.data) {
    const bodyData = Buffer.from(payload.body.data, "base64").toString("utf-8");

    if (payload.mimeType === "text/html") {
      htmlBody = bodyData;
    } else {
      textBody = bodyData;
    }
  }

  findParts(parts);

  if (htmlBody) {
    return sanitizeHtml(htmlBody);
  }

  if (textBody) {
    return textBody.replace(/\n/g, "<br>");
  }

  return message.snippet || "No content available";
}

function sanitizeHtml(html: string): string {
  let sanitized = html;

  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/javascript:/gi, "");

  return sanitized;
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
