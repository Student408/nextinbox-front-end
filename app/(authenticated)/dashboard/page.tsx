"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Mail, FileText, Zap, Send, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextInBox';

export default function DashboardPage() {
  const [servicesCount, setServicesCount] = useState(0);
  const [templatesCount, setTemplatesCount] = useState(0);
  const [rateLimit, setRateLimit] = useState(0);
  const [emailsSentToday, setEmailsSentToday] = useState(0);
  const [totalEmails, setTotalEmails] = useState(0);
  const [emailPeriod, setEmailPeriod] = useState("today");
  const [failedEmailsToday, setFailedEmailsToday] = useState(0);
  const [totalFailedEmails, setTotalFailedEmails] = useState(0);
  const [failedEmailPeriod, setFailedEmailPeriod] = useState("today");
  const [services, setServices] = useState<{ service_id: string; email_id: string }[]>([]);
  const [templates, setTemplates] = useState<{ template_id: string; name: string }[]>([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [userKey, setUserKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCounts();
    fetchServicesAndTemplates();
    fetchUserKey();
  }, []);

  async function fetchCounts() {
    const { count: servicesCount } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });

    const { count: templatesCount } = await supabase
      .from("templates")
      .select("*", { count: "exact", head: true });

    const { data: profileData } = await supabase
      .from("profile")
      .select("rate_limit")
      .single();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update to fetch successful emails from logs table
    const { count: todayEmailsCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "success")
      .gte("created_at", today.toISOString());

    const { count: allEmailsCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "success");

    const { count: todayFailedCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed")
      .gte("created_at", today.toISOString());

    const { count: totalFailedCount } = await supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed");

    setServicesCount(servicesCount || 0);
    setTemplatesCount(templatesCount || 0);
    setRateLimit(profileData?.rate_limit || 0);
    setEmailsSentToday(todayEmailsCount || 0);
    setTotalEmails(allEmailsCount || 0);
    setFailedEmailsToday(todayFailedCount || 0);
    setTotalFailedEmails(totalFailedCount || 0);
  }

  async function fetchServicesAndTemplates() {
    const { data: servicesData } = await supabase
      .from("services")
      .select("service_id, email_id");
    
    const { data: templatesData } = await supabase
      .from("templates")
      .select("template_id, name");

    setServices(servicesData || []);
    setTemplates(templatesData || []);
  }

  async function fetchUserKey() {
    const { data } = await supabase
      .from("profile")
      .select("user_key")
      .single();
    
    setUserKey(data?.user_key || "");
  }

  async function handleTestMail() {
    if (!selectedService || !selectedTemplate || !testEmail) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
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
      });

      if (!response.ok) throw new Error("Failed to send test mail");
      toast.success("Test mail sent successfully!");
    } catch (error) {
      toast.error("Failed to send test mail");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center text-[#FF6C37]">
          <LayoutGrid className="mr-2" /> Dashboard Overview
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Mail className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Email Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {servicesCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Active services
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Email Templates</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {templatesCount}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Available templates
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50 cursor-pointer"
          onClick={() => setEmailPeriod(emailPeriod === "today" ? "total" : "today")}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="text-[#FF6C37] w-6 h-6" />
                <CardTitle className="text-lg">Email Stats</CardTitle>
              </div>
              {emailPeriod === "today" ? 
                <ToggleLeft className="w-5 h-5 text-gray-500" /> : 
                <ToggleRight className="w-5 h-5 text-gray-500" />
              }
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {emailPeriod === "total" ? totalEmails : emailsSentToday}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {emailPeriod === "total" ? "All time sent" : "Sent in last 24h"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="text-[#FF6C37] w-6 h-6" />
              <CardTitle className="text-lg">Daily Rate Limit</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {rateLimit}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Emails remaining
            </p>
          </CardContent>
        </Card>

        <Card 
          className="border-2 border-gray-200 hover:border-red-500/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-red-500/50 cursor-pointer"
          onClick={() => setFailedEmailPeriod(failedEmailPeriod === "today" ? "total" : "today")}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="text-red-500 w-6 h-6" />
                <CardTitle className="text-lg">Failed</CardTitle>
              </div>
              {failedEmailPeriod === "today" ? 
                <ToggleLeft className="w-5 h-5 text-gray-500" /> : 
                <ToggleRight className="w-5 h-5 text-gray-500" />
              }
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-4xl font-bold text-gray-800 dark:text-gray-100">
              {failedEmailPeriod === "total" ? totalFailedEmails : failedEmailsToday}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {failedEmailPeriod === "total" ? "All time failed" : "Failed in last 24h"}
            </p>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger asChild>
            <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50 cursor-pointer">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Mail className="text-[#FF6C37] w-6 h-6" />
                  <CardTitle className="text-lg">Test Mail</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Send a test email
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Test Mail</DialogTitle>
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
              <Button onClick={handleTestMail} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Send Test Mail
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}