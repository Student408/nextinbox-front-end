import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 flex flex-col">
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">NextInBox</h1>
        <nav>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col justify-center items-center text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simplify Your Email Services</h2>
        <p className="text-lg sm:text-xl text-white mb-8">Manage all your email services and templates in one place</p>
        <Link href="/dashboard">
          <Button size="lg" variant="default">Get Started</Button>
        </Link>
      </main>
    </div>
  )
}

