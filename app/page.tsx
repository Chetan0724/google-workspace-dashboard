"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { GmailPanel } from "@/components/dashboard/gmail-panel";
import { CalendarPanel } from "@/components/dashboard/calendar-panel";
import { mockEmails, mockEvents } from "@/lib/mock-data";

export default function DashboardPage() {
  const [activeView, setActiveView] = useState("email-inbox");

  const isCalendarView = activeView === "calendar";
  const emailFilter = activeView.replace("email-", "");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-hidden">
          {isCalendarView ? (
            <CalendarPanel events={mockEvents} />
          ) : (
            <GmailPanel emails={mockEmails} filter={emailFilter} />
          )}
        </main>
      </div>
    </div>
  );
}
