"use client";

import { EmailItem } from "./email-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Archive, Trash2, MoreVertical, Reply, Forward } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Email } from "@/lib/types";

interface GmailPanelProps {
  emails: Email[];
  filter: string;
}

export function GmailPanel({ emails, filter }: GmailPanelProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const filteredEmails = emails.filter((email) => {
    if (filter === "inbox") return email.category === "inbox";
    if (filter === "starred") return email.starred;
    if (filter === "sent") return email.category === "sent";
    if (filter === "social") return email.category === "social";
    if (filter === "promotions") return email.category === "promotions";
    return true;
  });

  const unreadCount = filteredEmails.filter((e) => e.unread).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0">
      <div
        className={cn(
          "border-r transition-all",
          selectedEmail ? "w-[400px]" : "flex-1"
        )}
      >
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold capitalize">{filter}</h2>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-9rem)]">
          {filteredEmails.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No emails found</p>
              </div>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                onClick={() => setSelectedEmail(email)}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {selectedEmail && (
        <div className="flex-1">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{selectedEmail.subject}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmail(null)}
              >
                Close
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {selectedEmail.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{selectedEmail.from}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmail.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedEmail.date, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p>{selectedEmail.snippet}</p>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p className="mt-4">
                  Best regards,
                  <br />
                  {selectedEmail.from}
                </p>
              </div>

              <div className="mt-8 flex gap-2">
                <Button className="gap-2">
                  <Reply className="h-4 w-4" />
                  Reply
                </Button>
                <Button variant="outline" className="gap-2">
                  <Forward className="h-4 w-4" />
                  Forward
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
