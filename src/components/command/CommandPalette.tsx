"use client";
import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/context/ThemeContext";
import {
  Shield,
  Megaphone,
  Bell,
  Search,
  LayoutDashboard,
  Users,
  CreditCard,
  Moon,
  UserCircle,
} from "lucide-react";

interface CommandItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path?: string;
  keywords?: string[];
  group: "navigation" | "actions" | "settings";
  action?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { toggleTheme, theme } = useTheme();
  const [search, setSearch] = useState("");

  // Navigation items matching the sidebar
  const navigationItems: CommandItem[] = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/",
      keywords: ["home", "main", "overview"],
      group: "navigation",
    },
    {
      id: "users",
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/users",
      keywords: ["user", "people", "accounts", "members"],
      group: "navigation",
    },
    {
      id: "service-plans",
      name: "Service Plans",
      icon: <CreditCard className="w-5 h-5" />,
      path: "/plan-management",
      keywords: ["plan", "subscription", "pricing", "billing", "service"],
      group: "navigation",
    },
    {
      id: "security-tools",
      name: "Security Tools",
      icon: <Shield className="w-5 h-5" />,
      path: "/security-tools",
      keywords: ["security", "tools", "protection", "shield"],
      group: "navigation",
    },
    {
      id: "post-ads",
      name: "Post Ads",
      icon: <Megaphone className="w-5 h-5" />,
      path: "/post-ads",
      keywords: ["ads", "advertisement", "marketing", "promote"],
      group: "navigation",
    },
    {
      id: "push-notifications",
      name: "Push Notifications",
      icon: <Bell className="w-5 h-5" />,
      path: "/push-notifications",
      keywords: ["notification", "push", "alert", "bell", "message"],
      group: "navigation",
    },
  ];

  // Action items
  const actionItems: CommandItem[] = [
    {
      id: "search-users",
      name: "Search Users",
      icon: <Search className="w-5 h-5" />,
      path: "/users",
      keywords: ["search", "find", "user"],
      group: "actions",
    },
    {
      id: "view-profile",
      name: "View Profile",
      icon: <UserCircle className="w-5 h-5" />,
      path: "/profile",
      keywords: ["profile", "account", "me"],
      group: "actions",
    },
  ];

  // Settings items
  const settingsItems: CommandItem[] = [
    {
      id: "toggle-theme",
      name: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      icon: <Moon className="w-5 h-5" />,
      keywords: ["theme", "dark", "light", "mode", "toggle"],
      group: "settings",
      action: () => {
        toggleTheme();
        onClose();
      },
    },
  ];

  const allItems = [...navigationItems, ...actionItems, ...settingsItems];

  const handleSelect = (item: CommandItem) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      router.push(item.path);
      onClose();
    }
  };

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-0 overflow-hidden"
      showCloseButton={false}
    >
      <Command
        className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
        shouldFilter={true}
        filter={(value, search) => {
          if (!search) return 1;
          const item = allItems.find((i) => i.id === value);
          if (!item) return 0;
          
          const searchLower = search.toLowerCase();
          const nameMatch = item.name.toLowerCase().includes(searchLower);
          const keywordMatch = item.keywords?.some((k) =>
            k.toLowerCase().includes(searchLower)
          );
          
          return nameMatch || keywordMatch ? 1 : 0;
        }}
      >
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 px-4">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-gray-500 dark:text-gray-400" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-white"
            autoFocus
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400 opacity-100 sm:flex">
            <span className="text-xs">ESC</span>
          </kbd>
        </div>
        <Command.List className="max-h-[400px] overflow-y-auto p-2 no-scrollbar">
          <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No results found.
          </Command.Empty>

          {/* Navigation Group */}
          <Command.Group heading="Navigation">
            {navigationItems.map((item) => (
              <Command.Item
                key={item.id}
                value={item.id}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white data-[selected=true]:bg-orange-500/10 data-[selected=true]:text-orange-600 dark:data-[selected=true]:text-orange-400"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                </div>
              </Command.Item>
            ))}
          </Command.Group>

          {/* Actions Group */}
          {actionItems.length > 0 && (
            <Command.Group heading="Actions">
              {actionItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white data-[selected=true]:bg-orange-500/10 data-[selected=true]:text-orange-600 dark:data-[selected=true]:text-orange-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Settings Group */}
          {settingsItems.length > 0 && (
            <Command.Group heading="Settings">
              {settingsItems.map((item) => (
                <Command.Item
                  key={item.id}
                  value={item.id}
                  onSelect={() => handleSelect(item)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white data-[selected=true]:bg-orange-500/10 data-[selected=true]:text-orange-600 dark:data-[selected=true]:text-orange-400"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </Command>
    </Modal>
  );
};

export default CommandPalette;

