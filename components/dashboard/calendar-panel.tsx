"use client";

import { EventItem } from "./event-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CalendarDays className="h-5 w-5 text-primary-foreground" />
              </motion.div>
              <div>
                <h2 className="text-lg font-semibold">Calendar</h2>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), "EEEE, MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="meetings">Meetings Only</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Event
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
                value="week"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                This Week ({events.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[calc(100vh-12rem)]">
            <TabsContent value="today" className="mt-0 p-4">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {todayEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex h-[400px] items-center justify-center"
                  >
                    <div className="text-center">
                      <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-sm text-muted-foreground">
                        No events today
                      </p>
                      <Button variant="outline" size="sm" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  todayEvents.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="upcoming" className="mt-0 p-4">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {upcomingEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="week" className="mt-0 p-4">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </motion.div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 border-l bg-muted/30 p-4"
      >
        <h3 className="mb-4 font-semibold">Quick Stats</h3>
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">Events Today</p>
            <p className="text-2xl font-bold">{todayEvents.length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">Upcoming Events</p>
            <p className="text-2xl font-bold">{upcomingEvents.length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold">{events.length}</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-lg bg-card p-4"
          >
            <p className="text-sm text-muted-foreground">With Meeting Links</p>
            <p className="text-2xl font-bold">
              {events.filter((e) => e.meetingLink).length}
            </p>
          </motion.div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm">
                Notifications
              </Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reminders" className="text-sm">
                Email Reminders
              </Label>
              <Switch id="reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-join" className="text-sm">
                Auto-join Meetings
              </Label>
              <Switch id="auto-join" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
