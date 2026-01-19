"use client";

import { Video, Clock, Users, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Event } from "@/lib/types";

interface EventItemProps {
  event: Event;
}

export function EventItem({ event }: EventItemProps) {
  const duration = Math.round(
    (event.endDate.getTime() - event.date.getTime()) / (1000 * 60)
  );

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div
        className={cn(
          "h-1 w-full",
          event.color === "chart-1" && "bg-blue-500",
          event.color === "chart-2" && "bg-green-500",
          event.color === "chart-3" && "bg-yellow-500",
          event.color === "chart-4" && "bg-purple-500",
          event.color === "chart-5" && "bg-pink-500"
        )}
      />
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{event.title}</h3>
              {event.type === "today" && (
                <Badge variant="default" className="text-xs">
                  Today
                </Badge>
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
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {event.attendees.length}{" "}
                  {event.attendees.length === 1 ? "attendee" : "attendees"}
                </div>
              )}
            </div>

            {event.meetingLink && (
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
            )}
          </div>

          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-muted">
            <span className="text-xs font-medium text-muted-foreground">
              {format(event.date, "MMM")}
            </span>
            <span className="text-xl font-bold">{format(event.date, "d")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
