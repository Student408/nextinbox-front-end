'use client'

import { Card, CardContent } from '@/components/ui/card'

export function GettingStartedDocs() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Getting Started with NextInBox</h2>
        <p className="text-muted-foreground">
          NextInBox is a comprehensive email management platform designed for developers and businesses 
          who need reliable, scalable email automation solutions.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Core Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Email Service Management</h4>
              <p className="text-sm text-muted-foreground">
                Configure multiple SMTP services, manage credentials, and monitor performance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Template System</h4>
              <p className="text-sm text-muted-foreground">
                Create, manage, and version control your email templates with dynamic variables.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">API Integration</h4>
              <p className="text-sm text-muted-foreground">
                RESTful API for seamless integration with your applications.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Analytics & Monitoring</h4>
              <p className="text-sm text-muted-foreground">
                Track delivery rates, monitor failures, and analyze performance.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Quick Start Guide</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-[#FF6C37] pl-4">
            <h4 className="font-semibold">1. Authentication Setup</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Choose your preferred authentication method:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-sm">
              <li><strong>GitHub OAuth:</strong> Perfect for developer teams</li>
              <li><strong>Google OAuth:</strong> Ideal for business users</li>
            </ul>
          </div>

          <div className="border-l-4 border-[#FF6C37] pl-4">
            <h4 className="font-semibold">2. Email Service Configuration</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Set up your first email service:
            </p>
            <pre className="bg-muted p-4 rounded-md mt-2 text-sm">
{`{
  "host": "smtp.gmail.com",
  "port": 587,
  "email": "your@email.com",
  "password": "your-app-specific-password"
}`}
            </pre>
          </div>

          <div className="border-l-4 border-[#FF6C37] pl-4">
            <h4 className="font-semibold">3. Create Your First Template</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Example welcome email template:
            </p>
            <pre className="bg-muted p-4 rounded-md mt-2 text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<body>
  <h1>Welcome, {{name}}!</h1>
  <p>Thank you for joining {{company_name}}.</p>
  <p>Your account details:</p>
  <ul>
    <li>Email: {{email}}</li>
    <li>Account Type: {{account_type}}</li>
  </ul>
  <a href="{{verification_link}}">Verify Email</a>
</body>
</html>`}
            </pre>
          </div>

          <div className="border-l-4 border-[#FF6C37] pl-4">
            <h4 className="font-semibold">4. Send Your First Email</h4>
            <p className="text-sm text-muted-foreground mt-2">
              Using the API to send your first email:
            </p>
            <pre className="bg-muted p-4 rounded-md mt-2 text-sm">
{`curl -X POST "${process.env.NEXT_PUBLIC_NEXTINBOX_API_URL}/send-emails" \\
-H "Content-Type: application/json" \\
-d '{
  "user_key": "nib_your_api_key",
  "service_id": "your_service_id",
  "template_id": "your_template_id",
  "recipients": [{
    "email": "user@example.com",
    "name": "John Doe"
  }],
  "parameters": {
    "company_name": "NextInBox",
    "account_type": "Premium",
    "verification_link": "https://example.com/verify"
  }
}'`}
            </pre>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Common Use Cases</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">User Onboarding</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Welcome emails</li>
                <li>Email verification</li>
                <li>Getting started guides</li>
                <li>Account setup instructions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Transactional Emails</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Order confirmations</li>
                <li>Shipping notifications</li>
                <li>Password resets</li>
                <li>Account alerts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Marketing Campaigns</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Product announcements</li>
                <li>Newsletter distribution</li>
                <li>Promotional offers</li>
                <li>Event invitations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Customer Support</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Ticket confirmations</li>
                <li>Support responses</li>
                <li>Feedback surveys</li>
                <li>Status updates</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Best Practices</h3>
        <div className="grid gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Template Organization</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Use descriptive template names (e.g., &quot;welcome-email-v1&quot;)</li>
                <li>Group related templates in categories</li>
                <li>Version your templates (v1, v2, etc.)</li>
                <li>Document template variables</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Error Handling</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Implement retry logic for failed sends</li>
                <li>Monitor bounce rates and delivery issues</li>
                <li>Set up alerts for critical failures</li>
                <li>Log all email activities for debugging</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Performance Optimization</h4>
              <ul className="list-disc pl-4 text-sm space-y-2">
                <li>Use batch sending for large recipient lists</li>
                <li>Implement rate limiting to avoid throttling</li>
                <li>Cache frequently used templates</li>
                <li>Optimize images and content</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}