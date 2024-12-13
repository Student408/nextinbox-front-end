'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import CodeMirror from '@uiw/react-codemirror'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'

interface CodeDisplayProps {
  code: string
}

export function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy code')
    }
  }

  return (
    <Card className="w-full max-w-full lg:max-w-5xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Generated Code</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          className={`transition-colors duration-200 ${copied ? 'text-green-500' : ''}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <style jsx>{`
          .code-mirror-wrapper :global(.cm-scroller) {
            overflow: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .code-mirror-wrapper :global(.cm-scroller::-webkit-scrollbar) {
            display: none;
          }
        `}</style>
        <div className="relative rounded-md overflow-hidden code-mirror-wrapper">
          <CodeMirror
            value={code}
            theme={vscodeDark}
            readOnly
            height="400px"
            basicSetup={{
              lineNumbers: true,
              highlightActiveLineGutter: true,
              foldGutter: true,
            }}
            className="text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}