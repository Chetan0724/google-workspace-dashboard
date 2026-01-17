"use client";

import { Video, Clock, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Event } from "@/lib/types";

interface EventItemProps {
  event: Event;
}

export function EventItem({ event }: EventItemProps) {
  const duration = Math.round(
    (event.endDate.getTime() - event.date.getTime()) / (1000 * 60)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <motion.div
          className={cn(
            "h-1 w-full",
            event.color === "chart-1" && "bg-chart-1",
            event.color === "chart-2" && "bg-chart-2",
            event.color === "chart-3" && "bg-chart-3",
            event.color === "chart-4" && "bg-chart-4",
            event.color === "chart-5" && "bg-chart-5"
          )}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{event.title}</h3>
                {event.type === "today" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Badge variant="default" className="text-xs">
                      Today
                    </Badge>
                  </motion.div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(event.date, "h:mm a")} -{" "}
                  {format(event.endDate, "h:mm a")}
                </div>
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <span>{duration} min</span>
                </div>
                {event.attendees.length > 0 && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                        <Users className="h-3.5 w-3.5" />
                        {event.attendees.length}{" "}
                        {event.attendees.length === 1
                          ? "attendee"
                          : "attendees"}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Attendees</h4>
                        {event.attendees.map((attendee, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            {attendee}
                          </p>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>

              {event.meetingLink && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-2"
                    onClick={() => window.open(event.meetingLink!, "_blank")}
                  >
                    <Video className="h-3.5 w-3.5" />
                    Join Meeting
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-xs font-medium text-muted-foreground">
                {format(event.date, "MMM")}
              </span>
              <span className="text-xl font-bold">
                {format(event.date, "d")}
              </span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
