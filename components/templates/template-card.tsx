import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Edit2, Trash2, Copy, CheckCircle, Code2 } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

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

interface TemplateCardProps {
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  function copyTemplateId(id: string) {
    navigator.clipboard.writeText(id);
    setCopiedTemplateId(id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
    toast({
      title: "Copied",
      description: "Template ID copied to clipboard",
    });
  }

  function getPartialTemplateId(templateId: string): string {
    const length = Math.floor(templateId.length * 0.3);
    return templateId.substring(0, length) + "...";
  }

  function handleDelete() {
    setShowDeleteDialog(true);
  }

  return (
    <>
      <Card className="border-2 border-gray-200 hover:border-[#FF6C37]/50 hover:shadow-lg transition-all duration-300 group dark:border-gray-700 dark:hover:border-[#FF6C37]/50">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code2 className="text-[#FF6C37] w-6 h-6" />
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800 truncate max-w-[200px] dark:text-gray-100">
                  {template.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  ID: {getPartialTemplateId(template.template_id)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                onClick={() => copyTemplateId(template.template_id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
              >
                {copiedTemplateId === template.template_id ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={onEdit}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-[#FF6C37] hover:bg-[#FF6C37]/10 dark:text-gray-400 dark:hover:text-[#FF6C37]"
              >
                <Edit2 size={16} />
              </Button>
              <Button
                onClick={handleDelete}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/10 dark:text-gray-400 dark:hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="relative">
            <pre className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md max-h-[150px] overflow-hidden dark:bg-background dark:text-gray-300">
              {template.content.substring(0, 200)}...
            </pre>
          </div>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={onDelete}
        title="Delete Template"
        description={`Are you sure you want to delete "${template.name}"? This action cannot be undone.`}
      />
    </>
  );
}