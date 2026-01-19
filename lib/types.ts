export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  google_id: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  google_id: string;
  google_refresh_token: string;
  created_at: string;
  updated_at: string;
}

export interface SyncState {
  id: string;
  user_id: string;
  gmail_history_id: string | null;
  gmail_last_sync_at: string | null;
  gmail_sync_status: "idle" | "syncing" | "error";
  gmail_error_message: string | null;
  calendar_sync_token: string | null;
  calendar_last_sync_at: string | null;
  calendar_sync_status: "idle" | "syncing" | "error";
  calendar_error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GmailMessage {
  id: string;
  user_id: string;
  message_id: string;
  thread_id: string | null;
  subject: string | null;
  sender_name: string | null;
  sender_email: string | null;
  snippet: string | null;
  labels: string[];
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  created_at: string;
  updated_at: string;
}

export interface CalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: "needsAction" | "declined" | "tentative" | "accepted";
  organizer?: boolean;
  self?: boolean;
}

export interface CalendarEvent {
  id: string;
  user_id: string;
  event_id: string;
  calendar_id: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  attendees: CalendarAttendee[];
  is_all_day: boolean;
  status: "confirmed" | "tentative" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: string | number | undefined;
}

export interface Email {
  id: string;
  messageId: string;
  from: string;
  email: string;
  subject: string;
  snippet: string;
  date: Date;
  unread: boolean;
  category: string;
  starred: boolean;
  avatar: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  endDate: Date;
  meetingLink: string | null;
  attendees: string[];
  color: string;
  type: "today" | "upcoming";
}

export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailPayloadPart {
  filename?: string;
}

export interface GmailPayload {
  headers: GmailHeader[];
  parts?: GmailPayloadPart[];
}

export interface GmailMessageDetail {
  id: string;
  threadId: string;
  snippet: string;
  labelIds?: string[];
  payload: GmailPayload;
}

export interface GmailListResponse {
  messages?: Array<{ id: string }>;
}

export interface GoogleCalendarDateTime {
  dateTime?: string;
  date?: string;
}

export interface GoogleCalendarAttendee {
  email: string;
  displayName?: string;
  responseStatus?: string;
  organizer?: boolean;
  self?: boolean;
}

export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  hangoutLink?: string;
  attendees?: GoogleCalendarAttendee[];
  status?: string;
}

export interface GoogleCalendarListResponse {
  items?: GoogleCalendarEvent[];
}
