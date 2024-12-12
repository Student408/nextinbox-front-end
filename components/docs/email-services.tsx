'use client'

import { Card, CardContent } from '@/components/ui/card'

export function EmailServicesDocs() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Email Services</h2>
        <p className="text-muted-foreground">
          Configure and manage your email services for reliable email delivery.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Supported Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">SMTP</h4>
              <p className="text-sm text-muted-foreground">
                Configure SMTP settings for your email service.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">SendGrid</h4>
              <p className="text-sm text-muted-foreground">
                Integrate with SendGrid for scalable email delivery.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Mailgun</h4>
              <p className="text-sm text-muted-foreground">
                Use Mailgun for reliable email sending.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Amazon SES</h4>
              <p className="text-sm text-muted-foreground">
                Configure Amazon SES for cost-effective email delivery.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
