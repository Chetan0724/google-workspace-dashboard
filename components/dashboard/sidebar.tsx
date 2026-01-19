"use client";

import { Inbox, Send, Star, Tag, Users, Calendar, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Email } from "@/lib/types";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  emails: Email[];
}

export function Sidebar({ activeView, onViewChange, emails }: SidebarProps) {
  const getFilterCount = (filter: string) => {
    if (filter === "inbox") {
      return emails.filter((e) => e.category === "inbox").length;
    } else if (filter === "starred") {
      return emails.filter((e) => e.starred).length;
    } else if (filter === "sent") {
      return emails.filter((e) => e.category === "sent").length;
    } else if (filter === "social") {
      return emails.filter((e) => e.category === "social").length;
    } else if (filter === "promotions") {
      return emails.filter((e) => e.category === "promotions").length;
    }
    return 0;
  };

  const emailFilters = [
    {
      id: "inbox",
      label: "Inbox",
      icon: Inbox,
      count: getFilterCount("inbox"),
    },
    {
      id: "starred",
      label: "Starred",
      icon: Star,
      count: getFilterCount("starred"),
    },
    { id: "sent", label: "Sent", icon: Send, count: getFilterCount("sent") },
    {
      id: "social",
      label: "Social",
      icon: Users,
      count: getFilterCount("social"),
    },
    {
      id: "promotions",
      label: "Promotions",
      icon: Tag,
      count: getFilterCount("promotions"),
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Mail className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Workspace
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
          </div>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          <Button
            variant={activeView === "calendar" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("calendar")}
          >
            <Calendar className="mr-3 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={activeView.includes("email") ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onViewChange("email-inbox")}
          >
            <Mail className="mr-3 h-4 w-4" />
            Gmail
          </Button>
        </div>

        {activeView.includes("email") && (
          <>
            <Separator className="my-4 bg-sidebar-border" />
            <div className="space-y-1">
              <p className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60">
                FILTERS
              </p>
              {emailFilters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={
                      activeView === `email-${filter.id}`
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-between"
                    onClick={() => onViewChange(`email-${filter.id}`)}
                  >
                    <span className="flex items-center">
                      <Icon className="mr-3 h-4 w-4" />
                      {filter.label}
                    </span>
                    {filter.count > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {filter.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
