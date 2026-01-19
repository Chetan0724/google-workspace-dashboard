"use client";

import { Star, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Email } from "@/lib/types";

interface EmailItemProps {
  email: Email;
  onClick: () => void;
  isSelected?: boolean;
}

export function EmailItem({ email, onClick, isSelected }: EmailItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer gap-4 border-b p-4 transition-all hover:bg-accent/50",
        email.unread && "bg-muted/30",
        isSelected && "bg-accent"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback
            className={cn(
              "text-xs font-semibold",
              email.category === "promotions" &&
                "bg-orange-100 text-orange-700",
              email.category === "social" && "bg-blue-100 text-blue-700",
              email.category === "inbox" && "bg-primary text-primary-foreground"
            )}
          >
            {email.avatar}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-medium truncate",
                email.unread && "font-semibold"
              )}
            >
              {email.from}
            </p>
            {email.unread && (
              <Badge variant="default" className="h-5 px-1.5 text-xs">
                New
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(email.date, { addSuffix: true })}
            </div>
            {email.starred && (
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        </div>

        <p className={cn("text-sm truncate", email.unread && "font-medium")}>
          {email.subject}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {email.snippet}
        </p>
      </div>
    </div>
  );
}
