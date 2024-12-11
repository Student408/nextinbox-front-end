import { Template } from "@/types/templates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Mail } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import DOMPurify from 'dompurify'

interface PreviewEmailProps {
  template: Template | undefined
  previewData: Record<string, string>
  fieldMappings: Record<string, string>
  onSendEmails: () => Promise<void>
}

export function PreviewEmail({
  template,
  previewData,
  fieldMappings,
  onSendEmails,
}: PreviewEmailProps) {
  const [sending, setSending] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const renderContent = () => {
    if (!template) return ''

    let content = template.content
    // Replace placeholders with actual values from CSV
    Object.entries(fieldMappings).forEach(([placeholder, csvField]) => {
      const value = previewData[csvField] || ''
      content = content.replace(new RegExp(`{{${placeholder}}}`, 'g'), value)
    })

    // Sanitize the content to prevent altering the website's CSS
    return DOMPurify.sanitize(content, {
      ADD_TAGS: ['style'],
      ADD_ATTR: ['style', 'class', 'id', 'data-*'],
      KEEP_CONTENT: true,
      WHOLE_DOCUMENT: true
    })
  }

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(renderContent())
        iframeDoc.close()
      }
    }
  }, [template, previewData, fieldMappings])

  const getRecipientEmail = () => {
    // Try different common email field names from CSV
    const emailFieldNames = ['email', 'email_address', 'Email', 'EMAIL']
    for (const fieldName of emailFieldNames) {
      if (previewData[fieldName]) {
        return previewData[fieldName]
      }
    }
    return null
  }

  const getRecipientName = () => {
    // Try different common name field names from CSV
    const nameFieldNames = ['name', 'Name', 'NAME', 'full_name', 'recipient_name']
    for (const fieldName of nameFieldNames) {
      if (previewData[fieldName]) {
        return previewData[fieldName]
      }
    }
    return null
  }

  const handleSend = async () => {
    setSending(true)
    try {
      await onSendEmails()
    } finally {
      setSending(false)
    }
  }

  if (!template) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Select a template to preview the email
          </p>
        </CardContent>
      </Card>
    )
  }

  const recipientEmail = getRecipientEmail()
  const recipientName = getRecipientName()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Email Preview</CardTitle>
        <Button
          onClick={handleSend}
          disabled={sending || !recipientEmail}
          className="bg-[#FF6C37] hover:bg-[#FF6C37]/90"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {sending ? 'Sending...' : 'Send Emails'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recipientEmail && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Mail className="w-4 h-4 text-[#FF6C37]" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {recipientName || 'Recipient'}
                </p>
                <p className="text-sm text-muted-foreground">{recipientEmail}</p>
              </div>
              <Badge variant="outline" className="text-[#FF6C37] border-[#FF6C37]">
                Preview Recipient
              </Badge>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold mb-1">From</h3>
            <p className="text-sm text-muted-foreground">{template.from_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Subject</h3>
            <p className="text-sm text-muted-foreground">{template.subject}</p>
          </div>
          {template.reply_to && (
            <div>
              <h3 className="text-sm font-semibold mb-1">Reply To</h3>
              <p className="text-sm text-muted-foreground">{template.reply_to}</p>
            </div>
          )}
          {(template.cc || template.bcc) && (
            <div className="flex gap-4">
              {template.cc && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">CC</h3>
                  <p className="text-sm text-muted-foreground">{template.cc}</p>
                </div>
              )}
              {template.bcc && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">BCC</h3>
                  <p className="text-sm text-muted-foreground">{template.bcc}</p>
                </div>
              )}
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold mb-2">Content</h3>
            <iframe ref={iframeRef} className="w-full h-96 border rounded-lg bg-muted/50" />
          </div>
          {!recipientEmail && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
              No email field found in CSV data. Please ensure your CSV contains an email column.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}