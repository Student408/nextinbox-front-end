import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail, Zap, Layers } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">
      {/* Announcement Banner */}
      <div className="bg-[#FF6C37] py-2 text-center text-white">
        <p className="text-sm font-medium">
          NextBox V2 Launch – Register Today 👉
        </p>
      </div>

      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M37.793 10.793c-3.906-3.906-10.236-3.906-14.142 0l-13.06 13.06c-3.905 3.906-3.905 10.236 0 14.142 3.906 3.905 10.236 3.905 14.142 0l13.06-13.06c3.905-3.906 3.905-10.236 0-14.142z" fill="#FF6C37" />
            <path d="M24 36c6.627 0 12-5.373 12-12S30.627 12 24 12 12 17.373 12 24s5.373 12 12 12z" fill="#FF6C37" />
          </svg>
          <h1 className="text-2xl font-bold text-white">NextBox</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/templates" className="text-gray-300 hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/resources" className="text-gray-300 hover:text-white transition-colors">
            Resources
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#FF6C37] text-[#FF6C37] hover:bg-[#FF6C37] hover:text-white">
              Open App
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4">
        <div className="relative">
          {/* Decorative Line */}
          <div className="absolute left-0 top-0 w-[2px] h-48 bg-gradient-to-b from-[#FF6C37] to-transparent" />
          
          <div className="py-24 md:py-32">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Simplify Your{' '}
              <span className="bg-gradient-to-r from-[#FF6C37] to-[#FF8C37] text-transparent bg-clip-text">
                Email Services
              </span>
            </h2>
            <div className="max-w-3xl">
              <p className="text-xl md:text-2xl text-gray-400 mb-8">
                Manage all your email services and templates in one place. Low-code, visual email builder, powered by AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-[#FF6C37] hover:bg-[#FF6C37]/90 text-white px-8 py-6 text-lg rounded-full">
                    Get started — it&#39;s free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
            <FeatureCard
              icon={<Mail className="h-10 w-10 text-[#FF6C37]" />}
              title="Low-Code"
              description="Build and manage email workflows without complex coding"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-[#FF6C37]" />}
              title="Visual Builder"
              description="Design emails with our intuitive drag-and-drop interface"
            />
            <FeatureCard
              icon={<Layers className="h-10 w-10 text-[#FF6C37]" />}
              title="AI-Powered"
              description="Generate content and optimize delivery with AI assistance"
            />
          </div>

          {/* Product Preview */}
          {/* <div className="rounded-lg border border-white/10 overflow-hidden shadow-2xl">
            <img 
              src="/placeholder.svg?height=600&width=1200" 
              alt="NextBox Dashboard Preview" 
              className="w-full h-auto"
            />
          </div> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2023 NextBox. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-[#FF6C37]/50 transition-all duration-300">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  )
}

