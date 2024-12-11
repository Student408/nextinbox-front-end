import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail,  Loader2 } from "lucide-react";
import DOMPurify from "dompurify";


interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  name: string;
  subject: string;
  from_name: string;
  to_email?: string | null;
  reply_to?: string | null;
  cc?: string | null;
  bcc?: string | null;
}

export function PreviewDialog({ open, onOpenChange, content, name, subject, from_name, to_email, reply_to, cc, bcc }: PreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sanitize the content
  const sanitizedContent = DOMPurify.sanitize(content, {
    ADD_TAGS: ["style"],
    ADD_ATTR: ["style", "class", "id"],
    WHOLE_DOCUMENT: true,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] p-0 gap-0 shadow-lg">
        <div className="grid grid-cols-[380px,1fr] h-full">
          {/* Left Panel - Details */}
          <div className="p-8 border-r bg-background overflow-y-auto">
            <DialogHeader className="relative mb-8">
              <DialogTitle className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF6C37]/10 p-2.5 rounded-xl shadow-sm">
                    <Mail className="w-6 h-6 text-[#FF6C37]" />
                  </div>
                  <span className="font-semibold text-xl">{name || "Email Preview"}</span>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="rounded-xl bg-card p-6 shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Email Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="grid gap-2">
                    <div className="flex items-start">
                      <span className="font-medium w-20 text-gray-600 dark:text-gray-400">Subject:</span>
                      <span className="text-gray-800 dark:text-gray-200 flex-1">{subject}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-medium w-20 text-gray-600 dark:text-gray-400">From:</span>
                      <span className="text-gray-800 dark:text-gray-200 flex-1">{from_name}</span>
                    </div>
                    {to_email && (
                      <div className="flex items-start">
                        <span className="font-medium w-20 text-gray-600 dark:text-gray-400">To:</span>
                        <span className="text-gray-800 dark:text-gray-200 flex-1">{to_email}</span>
                      </div>
                    )}
                  </div>
                  {(reply_to || cc || bcc) && (
                    <div className="border-t pt-3 mt-3">
                      {reply_to && (
                        <div className="flex items-start mb-2">
                          <span className="font-medium w-20 text-gray-600 dark:text-gray-400">Reply-To:</span>
                          <span className="text-gray-800 dark:text-gray-200 flex-1">{reply_to}</span>
                        </div>
                      )}
                      {cc && (
                        <div className="flex items-start mb-2">
                          <span className="font-medium w-20 text-gray-600 dark:text-gray-400">CC:</span>
                          <span className="text-gray-800 dark:text-gray-200 flex-1">{cc}</span>
                        </div>
                      )}
                      {bcc && (
                        <div className="flex items-start">
                          <span className="font-medium w-20 text-gray-600 dark:text-gray-400">BCC:</span>
                          <span className="text-gray-800 dark:text-gray-200 flex-1">{bcc}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="relative h-full bg-background">
            <div className="h-full relative p-6">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              )}
              <iframe
                ref={iframeRef}
                title="Email Preview"
                className="w-full h-full bg-background rounded-xl shadow-sm transition-all duration-200"
                sandbox="allow-same-origin"
                srcDoc={sanitizedContent}
                onLoad={() => setIsLoading(false)}
                style={{ opacity: isLoading ? 0 : 1 }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}