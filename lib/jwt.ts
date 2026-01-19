import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { SessionPayload } from "./types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
const SESSION_DURATION = "7d";

export async function signJWT(
  payload: Omit<SessionPayload, "iat" | "exp">
): Promise<string> {
  return await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      payload &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string"
    ) {
      return payload as SessionPayload;
    }

    return null;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

const COOKIE_NAME = "session";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function createSession(
  response: NextResponse,
  payload: { userId: string; email: string }
): Promise<void> {
  const token = await signJWT(payload);

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyJWT(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
