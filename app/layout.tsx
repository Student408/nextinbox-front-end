import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/toaster'

export const runtime = 'edge'

export const metadata = {
  title: 'NextInBox',
  description: 'Manage your email services and templates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className="h-full bg-background text-foreground antialiased">
        <Providers>
          <div className="min-h-full">
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}