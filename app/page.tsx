import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Mail, Zap, Shield, Code, FileText, Braces } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Announcement Banner */}
      <div className="bg-[#FF6C37] py-1.5 text-center text-white relative z-10">
        <p className="text-sm font-medium">
          Introducing NextInBox - Professional Email Management Platform 🚀
        </p>
      </div>

      {/* Navigation - Simplified */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <Mail className="h-8 w-8 text-[#FF6C37]" />
          <h1 className="text-2xl font-bold text-foreground">NextInBox</h1>
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

      {/* Hero Section - Redesigned */}
      <main className="flex-grow relative z-10">
        <section className="container mx-auto px-6 py-24 md:py-28">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block animate-fade-in">
              <span className="px-3 py-1 text-sm font-medium bg-[#FF6C37]/10 text-[#FF6C37] rounded-full">
                Now in public beta
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
              Professional Email Management
              <span className="block text-[#FF6C37] mt-2">For Modern Teams</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive email management platform designed for developers and businesses 
              who need reliable, scalable email automation solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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

        {/* Features Section - Auto Scroll */}
        <section className="container mx-auto py-20 md:py-24 overflow-hidden">
          <div className="relative w-full">
            <div className="flex gap-6 animate-scroll">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<Mail className="h-8 w-8" />}
                      title="Email Service Management"
                      description="Configure multiple SMTP services, manage credentials, and monitor performance."
                    />
                  </div>
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<Code className="h-8 w-8" />}
                      title="Template System"
                      description="Create, manage, and version control your email templates with dynamic variables."
                    />
                  </div>
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<Shield className="h-8 w-8" />}
                      title="Security First"
                      description="Industry-standard encryption and role-based access control for your data."
                    />
                  </div>
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<Braces className="h-8 w-8" />}
                      title="Code Generation"
                      description="Automatically generate API integration code in multiple programming languages."
                    />
                  </div>
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<Zap className="h-8 w-8" />}
                      title="API Integration"
                      description="RESTful API for seamless integration with your applications."
                    />
                  </div>
                  <div className="flex-shrink-0 w-[300px]">
                    <FeatureCard
                      icon={<FileText className="h-8 w-8" />}
                      title="Analytics & Monitoring"
                      description="Track delivery rates, monitor failures, and analyze performance."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CodeGen Details Section - Minimalistic */}
        <section className="container mx-auto px-6 py-20 md:py-24 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">Powerful Code Generation</h3>
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
          </div>
        </section>

        {/* Template Preview Section - Modernized */}
        <section className="container mx-auto px-6 py-20 md:py-24">
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

        {/* CTA Section - Simplified */}
        <section className="container mx-auto px-6 py-20 md:py-24 text-center bg-gradient-to-b from-muted/20 to-background">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of developers and businesses using NextInBox for their email management needs.
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

      {/* Footer - Minimalistic */}
      <footer className="border-t border-border relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-6 w-6 text-[#FF6C37]" />
              <span className="font-bold">NextInBox</span>
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

// Updated FeatureCard component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group hover:scale-[1.02] transition-transform duration-300 ease-in-out p-4 bg-background/50 rounded-xl border border-border/50 snap-center">
      <div className="p-3 bg-[#FF6C37]/5 rounded-lg mb-4 w-12 h-12 flex items-center justify-center group-hover:bg-[#FF6C37]/10 transition-colors">
        <div className="text-[#FF6C37]">{icon}</div>
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}