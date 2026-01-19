"use client";

import { EventItem } from "./event-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/lib/types";

interface CalendarPanelProps {
  events: Event[];
}

export function CalendarPanel({ events }: CalendarPanelProps) {
  const todayEvents = events.filter((e) => e.type === "today");
  const upcomingEvents = events.filter((e) => e.type === "upcoming");

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Calendar</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="today" className="flex-1">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start bg-transparent p-0">
              <TabsTrigger
                value="today"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Today ({todayEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Upcoming ({upcomingEvents.length})
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                All ({events.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <TabsContent value="today" className="mt-0 p-4">
              <div className="space-y-3">
                {todayEvents.length === 0 ? (
                  <div className="flex h-[400px] items-center justify-center">
                    <div className="text-center">
                      <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        No events today
                      </p>
                    </div>
                  </div>
                ) : (
                  todayEvents.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0 p-4">
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-0 p-4">
              <div className="space-y-3">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      <div className="w-80 border-l bg-muted/30 p-4">
        <h3 className="mb-4 font-semibold">Quick Stats</h3>
        <div className="space-y-3">
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">Events Today</p>
            <p className="text-2xl font-bold">{todayEvents.length}</p>
          </div>
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          </div>
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div className="rounded-lg bg-card p-4">
            <p className="text-sm text-muted-foreground">With Meeting Links</p>
            <p className="text-2xl font-bold">
              {events.filter((e) => e.meetingLink).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
