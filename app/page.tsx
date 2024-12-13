import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Mail, Zap, Shield, Code, FileText, Braces } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Announcement Banner */}
      <div className="bg-[#FF6C37] py-2 text-center text-white">
        <p className="text-sm font-medium">
          Introducing GoMail - Professional Email Management Platform 🚀
        </p>
      </div>

      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-border">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-[#FF6C37]" />
          <h1 className="text-2xl font-bold text-foreground">GoMail</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
            Templates
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#FF6C37] text-[#FF6C37] hover:bg-[#FF6C37] hover:text-white">
              Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Professional Email Management
              <span className="block text-[#FF6C37]">Made Simple</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              A comprehensive email management platform designed for developers and businesses 
              who need reliable, scalable email automation solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-[#FF6C37] hover:bg-[#FF6C37]/90 text-white px-8">
                  Get Started Free
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <h3 className="text-3xl font-bold text-center mb-12">Core Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Mail />}
              title="Email Service Management"
              description="Configure multiple SMTP services, manage credentials, and monitor performance."
            />
            <FeatureCard
              icon={<Code />}
              title="Template System"
              description="Create, manage, and version control your email templates with dynamic variables."
            />
            <FeatureCard
              icon={<Shield />}
              title="Security First"
              description="Industry-standard encryption and role-based access control for your data."
            />
            <FeatureCard
              icon={<Braces />}
              title="Code Generation"
              description="Automatically generate API integration code in multiple programming languages for your email templates."
            />
            <FeatureCard
              icon={<Zap />}
              title="API Integration"
              description="RESTful API for seamless integration with your applications."
            />
            <FeatureCard
              icon={<FileText />}
              title="Analytics & Monitoring"
              description="Track delivery rates, monitor failures, and analyze performance."
            />
          </div>
        </section>

        {/* CodeGen Details Section */}
        <section className="container mx-auto px-4 py-16 bg-gradient-to-b from-background to-muted">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h3 className="text-3xl font-bold mb-6">Powerful Code Generation</h3>
            <p className="text-lg text-muted-foreground">
              Generate integration code automatically for your email templates in multiple programming languages.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h4 className="text-xl font-semibold mb-4 text-[#FF6C37]">Supported Languages</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Python</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>JavaScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>PHP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Go</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="text-xl font-semibold mb-4 text-[#FF6C37]">Features</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <Braces className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>API-ready code snippets with error handling</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Braces className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Dynamic template variable support</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Braces className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Authentication and security best practices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Braces className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Complete documentation and examples</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Template Preview Section */}
        <section className="container mx-auto px-4 py-16">
          <h3 className="text-3xl font-bold text-center mb-12">Professional Email Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['Welcome Emails', 'Order Confirmations', 'Password Reset', 'Newsletter'].map((template) => (
              <Card key={template} className="p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-xl font-semibold mb-4">{template}</h4>
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-hidden">
                    <code>{`<!DOCTYPE html>
<html>
<head>
  <title>${template}</title>
</head>
<body>
  <h1>{{title}}</h1>
  <p>{{content}}</p>
</body>
</html>`}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of developers and businesses using GoMail for their email management needs.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-[#FF6C37] hover:bg-[#FF6C37]/90 text-white px-8">
                Start Your Free Trial
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-6 w-6 text-[#FF6C37]" />
              <span className="font-bold">GoMail</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link href="/docs" className="text-muted-foreground hover:text-foreground">
                Docs
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-[#FF6C37]/10 rounded-lg mb-4">
          <div className="text-[#FF6C37]">{icon}</div>
        </div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Card>
  )
}