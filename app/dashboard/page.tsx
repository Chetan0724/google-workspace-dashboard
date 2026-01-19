"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { GmailPanel } from "@/components/dashboard/gmail-panel";
import { CalendarPanel } from "@/components/dashboard/calendar-panel";
import { Email, Event, GmailMessage, CalendarEvent, User } from "@/lib/types";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("email-inbox");
  const [emails, setEmails] = useState<Email[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUser();
    syncData();
  }, []);

  useEffect(() => {
    if (activeView.startsWith("email-")) {
      loadEmails();
    } else if (activeView === "calendar") {
      loadEvents();
    }
  }, [activeView, searchQuery]);

  const loadUser = async () => {
    try {
      const response = await fetch("/api/user");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Load user error:", error);
    }
  };

  const syncData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetch("/api/sync/gmail", { method: "POST" }),
        fetch("/api/sync/calendar", { method: "POST" }),
      ]);
      await loadEmails();
      await loadEvents();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadEmails = async () => {
    const filter = activeView.replace("email-", "");
    const response = await fetch(
      `/api/emails?filter=${filter}&search=${encodeURIComponent(searchQuery)}`
    );
    const data = await response.json();

    const transformedEmails: Email[] = (data.emails || []).map(
      (msg: GmailMessage) => ({
        id: msg.id,
        messageId: msg.message_id,
        from: msg.sender_name || msg.sender_email || "Unknown",
        email: msg.sender_email || "",
        subject: msg.subject || "(No subject)",
        snippet: msg.snippet || "",
        date: new Date(msg.received_at),
        unread: !msg.is_read,
        category: categorizeEmail(msg.labels),
        starred: msg.is_starred,
        avatar: getInitials(msg.sender_name || msg.sender_email || "U"),
      })
    );

    setEmails(transformedEmails);
  };

  const loadEvents = async () => {
    const response = await fetch(
      `/api/events?search=${encodeURIComponent(searchQuery)}`
    );
    const data = await response.json();

    const colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

    const transformedEvents: Event[] = (data.events || []).map(
      (evt: CalendarEvent, idx: number) => ({
        id: evt.id,
        title: evt.summary || "Untitled Event",
        date: new Date(evt.start_time),
        endDate: new Date(evt.end_time),
        meetingLink: evt.meeting_link,
        attendees: evt.attendees.map((a) => a.email),
        color: colors[idx % colors.length],
        type: isToday(new Date(evt.start_time)) ? "today" : "upcoming",
      })
    );

    setEvents(transformedEvents);
  };

  const handleRefresh = () => {
    syncData();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const isCalendarView = activeView === "calendar";
  const emailFilter = activeView.replace("email-", "");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        emails={emails}
      />

      <div className="flex flex-1 flex-col">
        <Header
          onRefresh={handleRefresh}
          loading={loading}
          user={user}
          onSearch={handleSearch}
        />

        <main className="flex-1 overflow-hidden">
          {isCalendarView ? (
            <CalendarPanel events={events} />
          ) : (
            <GmailPanel emails={emails} filter={emailFilter} />
          )}
        </main>
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function categorizeEmail(labels: string[]): string {
  if (labels.includes("SENT")) return "sent";
  if (labels.includes("CATEGORY_SOCIAL")) return "social";
  if (labels.includes("CATEGORY_PROMOTIONS")) return "promotions";
  if (labels.includes("STARRED")) return "starred";
  return "inbox";
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
