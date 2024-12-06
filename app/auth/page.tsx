'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get('redirectedFrom') || '/dashboard'

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking auth status:', error.message)
          setLoading(false)
          return
        }

        if (session?.user) {
          router.replace(redirectPath)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in auth check:', error)
        setLoading(false)
      }
    }

    checkUser()
  }, [router, redirectPath])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}