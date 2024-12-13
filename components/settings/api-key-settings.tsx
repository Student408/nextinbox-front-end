import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Key, Copy, RefreshCw, Check } from "lucide-react";
import { regenerateUserKey } from "@/lib/utils/profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ApiKeySettingsProps {
  profile: {
    user_id: string;
    user_key: string | null;
  } | null;
  onUpdate: () => void;
}

export function ApiKeySettings({ profile, onUpdate }: ApiKeySettingsProps) {
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  async function handleGenerateKey() {
    if (!profile?.user_id) return;

    try {
      setLoading(true);
      const { error } = await regenerateUserKey(profile.user_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "USER key generated successfully",
      });

      onUpdate();
    } catch (error) {
      console.error("Error generating USER key:", error);
      toast({
        title: "Error",
        description: "Failed to generate USER key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (profile?.user_key) {
      navigator.clipboard.writeText(profile.user_key);
      setIsCopied(true);
      toast({
        title: "Copied",
        description: "USER key copied to clipboard",
      });

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Key className="h-5 w-5 text-[#FF6C37]" />
        <h3 className="text-lg font-semibold">USER Key</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="apiKey" className="text-sm font-medium">
            Your USER Key
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                value={profile?.user_key || ""}
                readOnly
                type={showKey ? "text" : "password"}
                className="font-mono pr-20 text-sm bg-muted/50"
              />
              {profile?.user_key && (
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-3 h-full text-xs hover:bg-transparent hover:text-[#FF6C37]"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? "Hide" : "Show"}
                  </Button>
                </div>
              )}
            </div>
            {profile?.user_key && (
              <Button
                variant="outline"
                onClick={copyToClipboard}
                className="flex items-center gap-2 h-10 px-4 hover:text-[#FF6C37] hover:border-[#FF6C37]"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Your USER key grants access to the NextInBox USER. Keep it secure and never share it.
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-medium">Regenerate USER Key</h4>
                <p className="text-sm text-muted-foreground">
                  Generate a new key if your current one has been compromised
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={loading}
                    className="bg-[#FF6C37] hover:bg-[#FF6C37]/90 w-full sm:w-auto"
                  >
                    <RefreshCw
                      className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    {loading ? "Generating..." : "Regenerate Key"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Regenerate USER Key?</AlertDialogTitle>
                    <div className="space-y-4">
                      <AlertDialogDescription>
                        This action will affect your existing API key configuration.
                      </AlertDialogDescription>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        <li>
                          This action will invalidate your existing USER key, causing
                          any applications or scripts using it to stop working until
                          updated with the new key.
                        </li>
                        <li>
                          An USER key can send up to 250 emails per day, depending on
                          your service provider&apos;s limit. If the provider allows
                          500 emails per day, that will be the maximum limit, even if
                          you regenerate the USER key.
                        </li>
                      </ul>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleGenerateKey}
                      className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
                    >
                      Regenerate Key
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
