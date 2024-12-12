'use client'

export function APIKeysDocs() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <p className="text-muted-foreground">
          Manage your API keys for secure access to the NextInBox API.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Creating API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Follow these steps to create a new API key:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>Navigate to the API Keys section in your account settings.</li>
          <li>Click on &quot;Create New API Key&quot;.</li>
          <li>Enter a name for your API key and select the permissions.</li>
          <li>Click &quot;Generate&quot; to create the API key.</li>
          <li>Copy the API key and store it securely.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Using API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Include your API key in the request headers to authenticate API requests.
        </p>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`curl -X GET "${process.env.NEXT_PUBLIC_NEXTINBOX_API_URL}/endpoint" \\
-H "Authorization: Bearer YOUR_API_KEY"`}
        </pre>
      </section>
    </div>
  )
}
