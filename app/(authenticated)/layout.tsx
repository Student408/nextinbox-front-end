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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Add the following constants below the imports
const API_URL = process.env.NEXT_PUBLIC_NEXTINBOX_API_URL || 'http://localhost:8080';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextInBox';

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
  const [services, setServices] = useState<{ service_id: string; email_id: string }[]>([]);
  const [templates, setTemplates] = useState<{ template_id: string; name: string }[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [userKey, setUserKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseError, setResponseError] = useState<string>("");
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [responseSuccess, setResponseSuccess] = useState<boolean | null>(null);

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

  useEffect(() => {
    const fetchServicesAndTemplates = async () => {
      try {
        const { data: servicesData, error: servicesError } = await supabase.from("services").select("service_id, email_id");
        if (servicesError) throw servicesError;

        const { data: templatesData, error: templatesError } = await supabase.from("templates").select("template_id, name");
        if (templatesError) throw templatesError;

        setServices(servicesData || []);
        setTemplates(templatesData || []);
      } catch (error) {
        handleFetchError(error);
      }
    };

    const fetchUserKey = async () => {
      try {
        const { data, error } = await supabase.from("profile").select("user_key").single();
        if (error) throw error;

        setUserKey(data?.user_key || "");
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchServicesAndTemplates();
    fetchUserKey();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  async function handleTestMail() {
    if (!selectedService || !selectedTemplate || !testEmail) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setResponseError("");
    setApiErrors([]);
    setResponseSuccess(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_URL}/send-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_key: userKey,
          service_id: selectedService,
          template_id: selectedTemplate,
          recipients: [
            {
              email_address: testEmail,
              name: APP_NAME + " User"
            }
          ],
          parameters: {
            name: APP_NAME + " User"
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setApiErrors(errorData.errors || ["HTTP error occurred"]);
        setResponseError(errorData.message || `HTTP error! status: ${response.status}`);
        toast.error(errorData.message || "Failed to send test mail");
        return;
      }

      const data = await response.json();
      setResponseSuccess(data.success);

      if (!data.success) {
        setApiErrors(data.errors || ["Unknown error occurred"]);
        toast.error("Failed to send test mail");
        return;
      }

      toast.success("Test mail sent successfully!");
    } catch (error) {
      clearTimeout(timeoutId);

      let errorMessage = "Failed to send test mail";

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Request timed out. The server might be down or not responding.";
        } else if (error instanceof TypeError && error.message === "Failed to fetch") {
          errorMessage = "Unable to connect to the API. Please check your internet connection or try again later.";
        } else {
          errorMessage = error.message;
        }
      }

      setResponseError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFetchError(error: unknown) {
    if (error instanceof Error) {
      toast.error(`An error occurred: ${error.message}`);
    } else {
      toast.error("An unknown error occurred while fetching data.");
    }
  }

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
                <span className="font-semibold text-foreground truncate max-w-xs">
                  {user.name}
                </span>
                  {user?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 bg-background">{children}</main>

        {/* Test Mail Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50 cursor-pointer rounded-full fixed bottom-4 right-4 w-16 h-16 flex items-center justify-center">
              <Mail className="text-[#FF6C37] w-8 h-8" />
            </Card>
          </DialogTrigger>
          <DialogContent className="animate-popup">
            <DialogHeader>
              <DialogTitle>Send Test Mail</DialogTitle>
              <DialogDescription>
                Send a test email to verify your service and template configuration.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Select onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.service_id} value={service.service_id}>
                      {service.email_id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.template_id} value={template.template_id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Test email address"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            {(responseSuccess !== null || responseError || apiErrors.length > 0) && (
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                {responseSuccess !== null && (
                  <p className={`mb-1 ${responseSuccess ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    Status: {responseSuccess ? "Success" : "Failed"}
                  </p>
                )}
                {responseError && (
                  <p className="text-red-600 dark:text-red-400">
                    Error: {responseError}
                  </p>
                )}
                {apiErrors.length > 0 && (
                  <div className="text-red-600 dark:text-red-400">
                    {apiErrors.map((error, index) => (
                      <p key={index} className="mt-1">• {error}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleTestMail} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Test Mail
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <style jsx>{`
        .animate-popup {
          animation: popup 0.3s ease-out;
        }
        @keyframes popup {
          0% {
            transform: scale(0.9);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}