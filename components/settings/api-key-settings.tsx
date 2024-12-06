import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Key, Copy, RefreshCw, Check } from 'lucide-react'
import { regenerateUserKey } from '@/lib/utils/profile'

interface ApiKeySettingsProps {
  profile: {
    user_id: string
    user_key: string | null
  } | null
  onUpdate: () => void
}

export function ApiKeySettings({ profile, onUpdate }: ApiKeySettingsProps) {
  const [loading, setLoading] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  async function handleGenerateKey() {
    if (!profile?.user_id) return

    try {
      setLoading(true)
      const { error } = await regenerateUserKey(profile.user_id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'API key generated successfully',
      })

      onUpdate()
    } catch (error) {
      console.error('Error generating API key:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (profile?.user_key) {
      navigator.clipboard.writeText(profile.user_key)
      setIsCopied(true)
      toast({
        title: 'Copied',
        description: 'API key copied to clipboard',
      })
      
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Key className="h-5 w-5 text-[#FF6C37]" />
        <h3 className="text-lg font-semibold">API Key</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="apiKey">Your API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                value={profile?.user_key || ''}
                readOnly
                type={showKey ? 'text' : 'password'}
                className="font-mono pr-24"
              />
              {profile?.user_key && (
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-3 h-full text-xs"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
              )}
            </div>
            {profile?.user_key && (
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Your API key grants access to the NextInBox API. Keep it secure and never share it.
          </p>
        </div>

        <Button
          onClick={handleGenerateKey}
          disabled={loading}
          className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Generating...' : profile?.user_key ? 'Regenerate Key' : 'Generate Key'}
        </Button>
      </div>
    </div>
  )
}