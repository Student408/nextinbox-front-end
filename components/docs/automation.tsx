'use client'

import { Card, CardContent } from '@/components/ui/card'

export function AutomationDocs() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Automation</h2>
        <p className="text-muted-foreground">
          Automate your email workflows with our powerful automation tools.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Creating Automations</h3>
        <p className="text-sm text-muted-foreground">
          Set up automated workflows to streamline your email processes.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          <li>Navigate to the Automation section in your dashboard.</li>
          <li>Click on &quot;Create New Automation&quot;.</li>
          <li>Define the trigger event and conditions.</li>
          <li>Specify the actions to be performed.</li>
          <li>Save and activate the automation.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Common Automation Scenarios</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Welcome Series</h4>
              <p className="text-sm text-muted-foreground">
                Send a series of welcome emails to new subscribers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Abandoned Cart</h4>
              <p className="text-sm text-muted-foreground">
                Remind customers about items left in their cart.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Birthday Greetings</h4>
              <p className="text-sm text-muted-foreground">
                Send personalized birthday emails to your customers.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Re-engagement</h4>
              <p className="text-sm text-muted-foreground">
                Re-engage inactive subscribers with targeted emails.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
