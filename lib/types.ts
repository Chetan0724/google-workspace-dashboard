export interface Email {
  id: string;
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
  type: string;
}
