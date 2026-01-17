"use client";

import {
  Inbox,
  Send,
  Star,
  Tag,
  Users,
  Calendar,
  Settings,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const emailFilters = [
    { id: "inbox", label: "Inbox", icon: Inbox, count: 12 },
    { id: "starred", label: "Starred", icon: Star, count: 3 },
    { id: "sent", label: "Sent", icon: Send, count: 0 },
    { id: "social", label: "Social", icon: Users, count: 5 },
    { id: "promotions", label: "Promotions", icon: Tag, count: 8 },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex h-screen w-64 flex-col border-r bg-sidebar"
    >
      <div className="p-6">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Mail className="h-6 w-6 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Workspace
            </h1>
            <p className="text-xs text-sidebar-foreground/60">Dashboard</p>
          </div>
        </motion.div>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={activeView === "calendar" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("calendar")}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Calendar
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={activeView.includes("email") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange("email-inbox")}
            >
              <Mail className="mr-3 h-4 w-4" />
              Gmail
            </Button>
          </motion.div>
        </div>

        <AnimatePresence>
          {activeView.includes("email") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Separator className="my-4 bg-sidebar-border" />
              <div className="space-y-1">
                <p className="mb-2 px-3 text-xs font-semibold text-sidebar-foreground/60">
                  FILTERS
                </p>
                {emailFilters.map((filter, index) => {
                  const Icon = filter.icon;
                  return (
                    <motion.div
                      key={filter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
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
                        <AnimatePresence>
                          {filter.count > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Badge variant="secondary" className="ml-auto">
                                {filter.count}
                              </Badge>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-sidebar-border" />

      <div className="p-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
