'use client'


export function SecurityDocs() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Security</h2>
        <p className="text-muted-foreground">
          Learn about the security measures we take to protect your data.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Data Encryption</h3>
        <p className="text-sm text-muted-foreground">
          We use industry-standard encryption to protect your data in transit and at rest.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Access Control</h3>
        <p className="text-sm text-muted-foreground">
          Implement role-based access control to manage user permissions.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Security Best Practices</h3>
        <ul className="list-disc pl-6 space-y-2 text-sm">
          <li>Use strong, unique passwords for your accounts.</li>
          <li>Enable two-factor authentication (2FA) for added security.</li>
          <li>Regularly review and update your security settings.</li>
          <li>Monitor account activity for suspicious behavior.</li>
        </ul>
      </section>
    </div>
  )
}
