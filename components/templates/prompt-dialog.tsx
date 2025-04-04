import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (content: string) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export function PromptDialog({ open, onOpenChange, onGenerated }: PromptDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("modern");
  const [tone, setTone] = useState("professional");

  async function handleGenerate() {
    if (!prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (!API_KEY) {
        throw new Error("Gemini API key is not configured");
      }

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const fullPrompt = `Generate a responsive HTML email template with the following requirements:
        Content: ${prompt}
        Style: ${style}
        Tone: ${tone}
        
        Requirements:
        - Use {{.field}} for dynamic content use proper fields names
        - Use a modern and minimalistic design
        - Use internal styles for reusability and maintainability
        - Make it mobile-responsive
        - Include proper HTML email doctype and meta tags
        - Use table-based layout for better email client support
        - Return only the HTML code without any explanations`;

      const result = await model.generateContent(fullPrompt);
      const generatedHtml = result.response.text();

      // Remove opening and closing ```html and ``` tags
      const cleanedHtml = generatedHtml.replace(/```html\n|```\n?/g, "").trim();

      onGenerated(cleanedHtml);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Email template generated successfully",
      });
    } catch (error) {
      console.error("Error generating template:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[90%] p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Wand2 className="w-4 h-4 text-[#FF6C37]" />
            Generate Email Template
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-2">
            <Label>Describe your email template</Label>
            <Textarea
              placeholder="e.g., A welcome email for new users..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-24"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Style</Label>
              <Input
                placeholder="e.g., modern, minimal, corporate"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Input
                placeholder="e.g., professional, friendly, casual"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}