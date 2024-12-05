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
  LogOut,
  PanelLeft,
  Bell,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser();
  //     if (user) {
  //       setUser(user.email ? { email: user.email } : null);
  //     } else {
  //       router.push("/auth");
  //     }
  //   };
  //   checkUser();
  // }, [router]);

  useEffect(() => {
    const mockLogin = async () => {
      // Temporarily mock user credentials
      const mockUser = { email: "lokotwiststudio2@gmail.com" }; // Replace with your test email
      setUser(mockUser);
    };
  
    mockLogin();
  }, []);
  

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r transition-all duration-300 ease-in-out overflow-hidden shadow-md",
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
              className="hover:bg-gray-100 p-2 rounded-md transition text-gray-600 hover:text-[#FF6C37]"
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
                  icon: <PanelLeft className="w-5 h-5" />,
                  label: "Services",
                },
                {
                  href: "/templates",
                  icon: <FileText className="w-5 h-5" />,
                  label: "Templates",
                },
                {
                  href: "/settings",
                  icon: <Settings className="w-5 h-5" />,
                  label: "Settings",
                },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center group px-4 py-2 hover:bg-gray-100 transition",
                      "hover:text-[#FF6C37]",
                      isCollapsed ? "justify-center" : ""
                    )}
                  >
                    <span
                      className={cn(
                        "group-hover:text-[#FF6C37] text-gray-600",
                        isCollapsed ? "" : "mr-3"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && (
                      <span className="text-gray-700 group-hover:text-[#FF6C37]">
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
                "flex items-center w-full hover:bg-gray-100 rounded-md p-2 transition",
                "hover:text-[#FF6C37] text-gray-600",
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
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm h-16">
          <div className="flex items-center w-full">
            {/* Search Bar */}
            <div className="relative flex-grow max-w-xl mr-4">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6C37]/50"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* User and Notifications */}
            <div className="flex items-center ml-auto space-x-4">
              <button
                title="Notifications"
                className="text-gray-600 hover:text-[#FF6C37] transition"
              >
                <Bell className="w-5 h-5" />
              </button>

              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Welcome,</span>
                <span className="font-semibold text-gray-800 truncate max-w-xs">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
