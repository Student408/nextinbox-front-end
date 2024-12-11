import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail } from "lucide-react";
import DOMPurify from "dompurify";


interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
}

export function PreviewDialog({ open, onOpenChange, content }: PreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const createEmailDocument = (content: string) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ADD_TAGS: ["style"],
      ADD_ATTR: ["style", "class", "id"],
      WHOLE_DOCUMENT: true,
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            td, th {
              padding: 8px;
            }
          </style>
        </head>
        <body>
          ${sanitizedContent}
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (iframeRef.current && open) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        const emailDocument = createEmailDocument(content);
        iframeDoc.open();
        iframeDoc.write(emailDocument);
        iframeDoc.close();
      }
    }
  }, [content, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#FF6C37]" />
            Email Preview
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            ref={iframeRef}
            title="Email Preview"
            className="w-full h-full border rounded-lg bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}