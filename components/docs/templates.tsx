'use client'

import { Card, CardContent } from '@/components/ui/card'

export function TemplatesDocs() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <p className="text-muted-foreground">
          Create and manage professional email templates with our powerful template system.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Template Examples</h3>
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Welcome Email Template</h4>
              <pre className="bg-muted p-2 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: #FF6C37; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background: #FF6C37; color: white; padding: 10px 20px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to {{company_name}}!</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>Thank you for joining us. We're excited to have you on board!</p>
      <p>Your account has been created with the following details:</p>
      <ul>
        <li>Email: {{email}}</li>
        <li>Account Type: {{account_type}}</li>
      </ul>
      <p>To get started, please verify your email address:</p>
      <p style="text-align: center;">
        <a href="{{verification_link}}" class="button">Verify Email</a>
      </p>
    </div>
  </div>
</body>
</html>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Order Confirmation Template</h4>
              <pre className="bg-muted p-2 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { background: #f5f5f5; padding: 15px; margin: 15px 0; }
        .total { font-size: 18px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
        </div>
        <div class="content">
            <h2>Thank you for your order, John Doe!</h2>
            <p>Order Number: 123456</p>
            <div class="order-details">
                <h3>Order Summary:</h3>
                <p>Product 1 - 2 x $10.00</p>
                <p>Product 2 - 1 x $20.00</p>
                <p class="total">Total: $40.00</p>
            </div>
            <p>Shipping Address:</p>
            <p>123 Main St, Anytown, USA</p>
            <p>Estimated Delivery: January 1, 2024</p>
        </div>
    </div>
</body>
</html>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Password Reset Template</h4>
              <pre className="bg-muted p-2 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; }
    .warning { color: #f44336; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>We received a request to reset your password.</p>
      <p>Click the button below to reset your password:</p>
      <p style="text-align: center;">
        <a href="{{reset_link}}" class="button">Reset Password</a>
      </p>
      <p class="warning">This link will expire in {{expiry_time}} minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Newsletter Template</h4>
              <pre className="bg-muted p-2 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: #333; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Monthly Newsletter</h1>
    </div>
    <div class="content">
      <h2>Latest Updates</h2>
      <p>Stay updated with the latest news and updates from our company.</p>
      <ul>
        <li>Update 1</li>
        <li>Update 2</li>
        <li>Update 3</li>
      </ul>
    </div>
    <div class="footer">
      <p>&copy; {{year}} {{company_name}}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Event Invitation Template</h4>
              <pre className="bg-muted p-2 sm:p-4 rounded-md text-xs sm:text-sm overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <style>
    .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
    .header { background: #FF6C37; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background: #FF6C37; color: white; padding: 10px 20px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're Invited!</h1>
    </div>
    <div class="content">
      <h2>Hello {{name}},</h2>
      <p>We are excited to invite you to our upcoming event.</p>
      <p>Event Details:</p>
      <ul>
        <li>Date: {{event_date}}</li>
        <li>Time: {{event_time}}</li>
        <li>Location: {{event_location}}</li>
      </ul>
      <p style="text-align: center;">
        <a href="{{rsvp_link}}" class="button">RSVP Now</a>
      </p>
    </div>
  </div>
</body>
</html>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Template Variables</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Common Variables</h4>
              <ul className="list-disc pl-4 text-xs sm:text-sm space-y-2">
                <li><code>{`{{name}}`}</code> - Recipient&apos;s name</li>
                <li><code>{`{{email}}`}</code> - Recipient&apos;s email</li>
                <li><code>{`{{company_name}}`}</code> - Your company name</li>
                <li><code>{`{{date}}`}</code> - Current date</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold mb-2">Dynamic Content</h4>
              <ul className="list-disc pl-4 text-xs sm:text-sm space-y-2">
                <li><code>{`{{#each items}}`}</code> - Loop through arrays</li>
                <li><code>{`{{#if condition}}`}</code> - Conditional content</li>
                <li><code>{`{{> partial}}`}</code> - Include partials</li>
                <li><code>{`{{formatDate date}}`}</code> - Format helpers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}