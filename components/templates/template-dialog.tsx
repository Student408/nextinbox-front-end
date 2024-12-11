import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Eye, Wand2 } from "lucide-react";
import { PromptDialog } from "./prompt-dialog";
import { PreviewDialog } from "./preview-dialog";

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

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Partial<Template> | null;
  onSuccess: () => void;
}

export function TemplateDialog({
  open,
  onOpenChange,
  template,
  onSuccess,
}: TemplateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Template>>({
    name: "",
    content: "",
    to_email: "",
    from_name: "",
    reply_to: "",
    subject: "",
    bcc: "",
    cc: "",
  });
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData(template);
    } else {
      setFormData({
        name: "",
        content: "",
        to_email: "",
        from_name: "",
        reply_to: "",
        subject: "",
        bcc: "",
        cc: "",
      });
    }
  }, [template]);

  async function handleSubmit() {
    setIsLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add/edit a template",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.name || !formData.content || !formData.from_name || !formData.subject) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      if (!template) {
        const { error } = await supabase.from("templates").insert([
          {
            ...formData,
            user_id: user.id,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Template added successfully",
        });
      } else {
        const { error } = await supabase
          .from("templates")
          .update({
            ...formData,
          })
          .eq("template_id", template.template_id)
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Template updated successfully",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${template ? "update" : "add"} template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGeneratedContent = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[90vw] w-[95vw] max-h-[90vh]">
          <DialogHeader className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {template ? "Edit Email Template" : "Create Email Template"}
              </DialogTitle>
              <div className="flex items-center gap-3 mr-10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPromptDialog(true)}
                  className="text-[#FF6C37] border-[#FF6C37]"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreviewDialog(true)}
                  className="text-[#FF6C37] border-[#FF6C37]"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="text-[#FF6C37] border-[#FF6C37]"
                >
                  {isLoading ? "Saving..." : template ? "Update Template" : "Save Template"}
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row h-[calc(90vh-100px)]">
            <div className="lg:w-[30%] p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Template Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Welcome Email"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-gray-700 dark:text-gray-300">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Email subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="from_name" className="text-gray-700 dark:text-gray-300">From Name</Label>
                  <Input
                    id="from_name"
                    placeholder="Sender's name"
                    value={formData.from_name}
                    onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="to_email" className="text-gray-700 dark:text-gray-300">To Email (optional)</Label>
                  <Input
                    id="to_email"
                    placeholder="Recipient's email"
                    value={formData.to_email || ""}
                    onChange={(e) => setFormData({ ...formData, to_email: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="reply_to" className="text-gray-700 dark:text-gray-300">Reply-To (optional)</Label>
                  <Input
                    id="reply_to"
                    placeholder="Reply-to email"
                    value={formData.reply_to || ""}
                    onChange={(e) => setFormData({ ...formData, reply_to: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="cc" className="text-gray-700 dark:text-gray-300">CC (optional)</Label>
                  <Input
                    id="cc"
                    placeholder="CC email addresses"
                    value={formData.cc || ""}
                    onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="bcc" className="text-gray-700 dark:text-gray-300">BCC (optional)</Label>
                  <Input
                    id="bcc"
                    placeholder="BCC email addresses"
                    value={formData.bcc || ""}
                    onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                    className="mt-1 border-[#FF6C37]/30 focus:border-[#FF6C37] focus:ring-[#FF6C37]/20 dark:bg-background dark:border-[#FF6C37]/50 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-[70%] h-full p-2 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
              <div className="mb-4 px-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300 text-lg">
                  HTML & CSS Content
                </Label>
              </div>
              <div className="w-full flex-1 overflow-hidden relative rounded-md">
                <div className="absolute inset-0">
                  <CodeMirror
                    value={formData.content}
                    height="100%"
                    width="100%"
                    theme={vscodeDark}
                    extensions={[html()]}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    basicSetup={{
                      lineNumbers: true,
                      highlightActiveLineGutter: true,
                      foldGutter: true,
                      autocompletion: true,
                      indentOnInput: true,
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PromptDialog
        open={showPromptDialog}
        onOpenChange={setShowPromptDialog}
        onGenerated={handleGeneratedContent}
      />

      <PreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        content={formData.content || ""}
        name={formData.name || ""}
        subject={formData.subject || ""}
        from_name={formData.from_name || ""}
        to_email={formData.to_email}
        reply_to={formData.reply_to}
        cc={formData.cc}
        bcc={formData.bcc}
      />
    </>
  );
}