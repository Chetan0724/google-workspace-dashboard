"use client";

import { Star, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { Email } from "@/lib/types";

interface EmailItemProps {
  email: Email;
  onClick: () => void;
}

export function EmailItem({ email, onClick }: EmailItemProps) {
  const [isStarred, setIsStarred] = useState(email.starred);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "group flex cursor-pointer gap-4 border-b p-4 transition-all hover:bg-accent/50",
        email.unread && "bg-muted/30"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => {
            setIsChecked(checked as boolean);
          }}
          onClick={(e) => e.stopPropagation()}
        />

        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="h-10 w-10 shrink-0 cursor-pointer">
              <AvatarFallback
                className={cn(
                  "text-xs font-semibold",
                  email.category === "promotions" &&
                    "bg-chart-4 text-chart-4-foreground",
                  email.category === "social" &&
                    "bg-chart-2 text-chart-2-foreground",
                  email.category === "inbox" &&
                    "bg-primary text-primary-foreground"
                )}
              >
                {email.avatar}
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold">{email.from}</h4>
              <p className="text-sm text-muted-foreground">{email.email}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="capitalize">
                  {email.category}
                </Badge>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-sm font-medium",
                email.unread && "font-semibold"
              )}
            >
              {email.from}
            </p>
            {email.unread && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Badge variant="default" className="h-5 px-1.5 text-xs">
                  New
                </Badge>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(email.date, { addSuffix: true })}
            </div>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "opacity-0 transition-opacity group-hover:opacity-100",
                isStarred && "opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setIsStarred(!isStarred);
              }}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  isStarred
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground hover:text-yellow-400"
                )}
              />
            </motion.button>
          </div>
        </div>

        <p className={cn("text-sm", email.unread && "font-medium")}>
          {email.subject}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {email.snippet}
        </p>
      </div>
    </motion.div>
  );
}
