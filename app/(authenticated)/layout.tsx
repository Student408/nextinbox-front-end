"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  FileText,
  Settings,
  FileTerminal,
  ContactRound,
  FileClock,
  LogOut,
  PlugZap,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationList } from "@/components/notifications/notification-list";

// Custom hook for sidebar state
const useSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return { isCollapsed, toggleSidebar };
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user.email ? { name: user.user_metadata.full_name, email: user.email } : null);
      } else {
        router.push("/auth");
      }
    };
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-card border-r transition-all duration-300 ease-in-out overflow-hidden shadow-md",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b shadow-sm h-16">
            {!isCollapsed && (
              <h2 className="text-xl font-bold text-[#FF6C37]">NextInBox</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="hover:bg-accent p-2 rounded-md transition text-muted-foreground hover:text-[#FF6C37]"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {[
                {
                  href: "/dashboard",
                  icon: <LayoutGrid className="w-5 h-5" />,
                  label: "Dashboard",
                },
                {
                  href: "/services",
                  icon: <PlugZap className="w-5 h-5" />,
                  label: "Services",
                },
                {
                  href: "/templates",
                  icon: <FileTerminal className="w-5 h-5" />,
                  label: "Templates",
                },
                {
                  href: "/contacts",
                  icon: <ContactRound className="w-5 h-5" />,
                  label: "Contacts",
                },
                {
                  href: "/logs",
                  icon: <FileClock className="w-5 h-5" />,
                  label: "Logs",
                },
                {
                  href: "/settings",
                  icon: <Settings className="w-5 h-5" />,
                  label: "Settings",
                },
                {
                  href: "/docs",
                  icon: <FileText className="w-5 h-5" />,
                  label: "Docs",
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center group px-4 py-2 hover:bg-accent transition",
                      "hover:text-[#FF6C37]",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    <span
                      className={cn(
                        "group-hover:text-[#FF6C37] text-muted-foreground",
                        isCollapsed ? "" : "mr-3"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-foreground group-hover:text-[#FF6C37]">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t p-4">
            <button
              onClick={handleSignOut}
              className={cn(
                "flex items-center w-full hover:bg-accent rounded-md p-2 transition",
                "hover:text-[#FF6C37] text-muted-foreground",
                isCollapsed ? "justify-center" : ""
              )}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Sign Out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b px-4 py-2 flex items-center justify-between shadow-sm h-16">
          <div className="flex items-center w-full">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-xl mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6C37]/50 bg-background"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>

            {/* User and Notifications */}
            <div className="flex items-center ml-auto space-x-4">
              <ThemeToggle />
              <NotificationList />

              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Welcome,</span>
                <span className="font-semibold text-foreground truncate max-w-xs">
                  {user.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 bg-background">{children}</main>
      </div>
    </div>
  );
}