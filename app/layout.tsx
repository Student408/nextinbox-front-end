import './globals.css'

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
    <html lang="en" className="h-full">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className="h-full bg-gray-50 text-gray-900 antialiased">
        <div className="min-h-full">
          {children}
        </div>
      </body>
    </html>
  )
}