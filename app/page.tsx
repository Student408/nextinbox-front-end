import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Zap, Shield, Code, FileText, Braces, Check, ChevronRight, Copy, CheckCheck, Sparkles, Users, BarChart, MessageSquare, ShoppingBag, KeyRound, Mail as MailIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Navigation - Simplified */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
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
        <section className="container mx-auto px-6 py-20 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-block animate-fade-in">
              <span className="px-3 py-1 text-sm font-medium bg-[#FF6C37]/10 text-[#FF6C37] rounded-full">
                Now in public alpha
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
                      description="Configure multiple SMTP services and manage credentials."
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

        {/* CodeGen Details Section - Enhanced */}
        <section className="container mx-auto px-6 py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h3 className="text-4xl md:text-5xl font-bold">Powerful Code Generation</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Generate integration code automatically for your email templates in multiple programming languages.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              {/* Languages Panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4">
                  <h4 className="text-xl font-semibold text-[#FF6C37]">Supported Languages</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {['Python', 'JavaScript', 'PHP', 'Go', 'Ruby', 'Java'].map((lang) => (
                      <div key={lang} 
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Code className="h-5 w-5 text-[#FF6C37]" />
                        <span className="font-medium">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                  <h4 className="text-xl font-semibold text-[#FF6C37] mb-4">Key Features</h4>
                  <ul className="space-y-3">
                    {[
                      'Type-safe code generation',
                      'Error handling included',
                      'Authentication built-in',
                      'Rate limiting support',
                      'Automatic retries',
                      'Async/await support'
                    ].map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-[#FF6C37]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Preview */}
              <div className="lg:col-span-3 bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/50 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">example.py</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="language-python">{`from nextinbox import NextInBox
from nextinbox.templates import EmailTemplate

# Initialize the client
client = NextInBox(api_key="your_api_key")

# Create email template
template = EmailTemplate(
    name="Welcome Email",
    subject="Welcome to {{company}}!",
    content="""
    Hi {{name}},
    Welcome to {{company}}! 
    We're excited to have you on board.
    """
)

# Send email using the template
response = client.send_email(
    template=template,
    to="user@example.com",
    variables={
        "name": "John",
        "company": "NextInBox"
    }
)

print(f"Email sent: {response.message_id}")
`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/docs" className="inline-flex items-center text-[#FF6C37] hover:text-[#FF6C37]/80 transition-colors">
                <span className="font-medium">View Documentation</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* Template Preview Section - Enhanced and Mobile Optimized */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h3 className="text-3xl md:text-5xl font-bold">Professional Email Templates</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Ready-to-use email templates for every business need. Customize and deploy in minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                {
                  title: 'Welcome Onboard',
                  description: 'Perfect for new user signups and customer onboarding',
                  variables: ['name', 'company', 'actionUrl'],
                  icon: <MessageSquare className="h-6 w-6" />
                },
                {
                  title: 'Order Confirmation',
                  description: 'Automated order notifications with tracking details',
                  variables: ['orderNumber', 'items', 'total', 'trackingUrl'],
                  icon: <ShoppingBag className="h-6 w-6" />
                },
                {
                  title: 'Password Reset',
                  description: 'Secure password reset flow with time-limited tokens',
                  variables: ['resetUrl', 'expiry', 'userEmail'],
                  icon: <KeyRound className="h-6 w-6" />
                },
                {
                  title: 'Newsletter',
                  description: 'Engaging newsletter template with rich media support',
                  variables: ['content', 'preferencesUrl', 'unsubscribeUrl'],
                  icon: <MailIcon className="h-6 w-6" />
                }
              ].map((template) => (
                <div key={template.title} 
                  className="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap">
                    <button className="p-2 rounded-lg bg-background/50 hover:bg-background backdrop-blur-sm border border-border/50 transition-colors" title="Copy">
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <div className="p-2 rounded-lg bg-[#FF6C37]/10 text-[#FF6C37] text-sm font-medium">
                      Preview
                    </div>
                  </div>
                  
                  <div className="p-6 pt-16">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-[#FF6C37]/5 text-[#FF6C37]">
                        {template.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{template.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/50">
                      <div className="text-sm font-medium mb-2">Template Variables</div>
                      <div className="flex flex-wrap gap-2">
                        {template.variables.map((variable) => (
                          <span key={variable} 
                            className="px-2 py-1 text-xs rounded-md bg-muted text-muted-foreground">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-muted/50 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last updated 2 days ago
                    </span>
                    <div className="flex items-center gap-1 text-sm text-[#FF6C37]">
                      <CheckCheck className="h-4 w-4" />
                      <span>Test Passed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/templates" className="inline-flex items-center text-[#FF6C37] hover:text-[#FF6C37]/80 transition-colors">
                <span className="font-medium">Browse All Templates</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced and Mobile Optimized */}
        <section className="container mx-auto px-6 py-20 md:py-32">
          <div className="relative max-w-6xl mx-auto">
            {/* Background Gradient Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6C37]/10 via-transparent to-[#FF6C37]/10 rounded-[2rem] blur-3xl" />
            
            <div className="relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-[2rem] overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 p-8 md:p-16">
                <div className="space-y-8">
                  <h3 className="text-3xl md:text-5xl font-bold leading-tight">
                    Ready to Transform Your Email
                    <span className="block text-[#FF6C37]">Communication?</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {[
                      {
                        icon: <Sparkles className="h-5 w-5" />,
                        title: "Free Trial",
                        description: "Start with our 14-day free trial, no credit card required"
                      },
                      {
                        icon: <Users className="h-5 w-5" />,
                        title: "5,000+ Teams",
                        description: "Join thousands of successful businesses using NextInBox"
                      },
                      {
                        icon: <BarChart className="h-5 w-5" />,
                        title: "99.9% Uptime",
                        description: "Enterprise-grade reliability you can count on"
                      }
                    ].map((feature) => (
                      <div key={feature.title} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[#FF6C37]/10 text-[#FF6C37]">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard" className="flex-1">
                      <Button size="lg" className="w-full bg-[#FF6C37] hover:bg-[#FF6C37]/90 text-white">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/pricing" className="flex-1">
                      <Button size="lg" variant="outline" className="w-full">
                        View Pricing
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-[#FF6C37]/5 rounded-xl blur-2xl" />
                  <div className="relative grid grid-cols-2 gap-4 p-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:scale-105 transition-transform"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#FF6C37]/10 mb-3" />
                        <div className="space-y-2">
                          <div className="h-2 w-20 bg-border/50 rounded" />
                          <div className="h-2 w-16 bg-border/50 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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