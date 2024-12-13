"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileTerminal, Plus } from "lucide-react";
import { TemplateDialog } from "@/components/templates/template-dialog";
import { TemplateCard } from "@/components/templates/template-card";
import { EmptyState } from "@/components/templates/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

interface Template {
  template_id: string;
  name: string;
  content: string;
  to_email: string | null;
  from_name: string;
  reply_to: string | null;
  subject: string;
  bcc: string | null;
  cc: string | null;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Partial<Template> | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to view templates",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("templates")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to fetch templates: ${error.message}`,
        variant: "destructive",
      });
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  }

  async function deleteTemplate(id: string) {
    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("template_id", id);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to delete template: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
      await fetchTemplates();
    }
  }

  function handleEdit(template: Template) {
    setCurrentTemplate(template);
    setIsDialogOpen(true);
  }

  function handleAdd() {
    setCurrentTemplate(null);
    setIsDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 dark:bg-background dark:text-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37]">
            <FileTerminal className="mr-2" /> Email Templates
          </h2>
          <Skeleton className="h-10 w-full sm:w-[140px]" />
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 dark:bg-background dark:text-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37]">
          <FileTerminal className="mr-2" /> Email Templates
        </h2>
        <Button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-[#FF6C37] hover:bg-[#FF5722] text-white font-semibold"
        >
          <Plus size={16} className="mr-2" /> Add New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.template_id}
            template={template}
            onEdit={() => handleEdit(template)}
            onDelete={() => deleteTemplate(template.template_id)}
          />
        ))}
      </div>

      {!isLoading && templates.length === 0 && <EmptyState onAdd={handleAdd} />}

      <TemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        template={currentTemplate}
        onSuccess={fetchTemplates}
      />
    </div>
  );
}