"use client";

import { EmailItem } from "./email-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Email } from "@/lib/types";
import { ArrowLeft, Loader2 } from "lucide-react";

interface GmailPanelProps {
  emails: Email[];
  filter: string;
}

interface FullEmailData {
  subject: string;
  from: string;
  email: string;
  date: Date;
  body: string;
  avatar: string;
}

export function GmailPanel({ emails, filter }: GmailPanelProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [fullEmailData, setFullEmailData] = useState<FullEmailData | null>(
    null
  );
  const [loadingFullEmail, setLoadingFullEmail] = useState(false);

  const unreadCount = emails.filter((e) => e.unread).length;

  const handleEmailClick = async (email: Email) => {
    setSelectedEmail(email);
    setLoadingFullEmail(true);
    setFullEmailData(null);

    try {
      const response = await fetch(`/api/emails/${email.messageId}`);
      const data = await response.json();

      if (data.email) {
        setFullEmailData(data.email);
      }
    } catch (error) {
      console.error("Error loading full email:", error);
    } finally {
      setLoadingFullEmail(false);
    }
  };

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
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-9rem)]">
          {emails.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">No emails found</p>
              </div>
            </div>
          ) : (
            emails.map((email) => (
              <EmailItem
                key={email.id}
                email={email}
                onClick={() => handleEmailClick(email)}
                isSelected={selectedEmail?.id === email.id}
              />
            ))
          )}
        </ScrollArea>
      </div>

      {selectedEmail && (
        <div className="flex-1 flex flex-col">
          <div className="border-b p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate flex-1">
              {fullEmailData?.subject || selectedEmail.subject}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedEmail(null);
                setFullEmailData(null);
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {fullEmailData?.avatar || selectedEmail.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {fullEmailData?.from || selectedEmail.from}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {fullEmailData?.email || selectedEmail.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        fullEmailData?.date || selectedEmail.date,
                        "MMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {loadingFullEmail ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : fullEmailData ? (
                <div
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: fullEmailData.body }}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>{selectedEmail.snippet}</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
