'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ProfileSettings } from '@/components/settings/profile-settings'
import { ApiKeySettings } from '@/components/settings/api-key-settings'
import { DangerZone } from '@/components/settings/danger-zone'
import { Card } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<{
    user_id: string
    user_key: string | null
    email: string | null
  } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profile')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError)
          return
        }

        setProfile({
          user_id: user.id,
          user_key: profileData?.user_key || null,
          email: user.email ?? null
        })
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold flex items-center text-[#FF6C37] mb-4 sm:mb-6">
        <Settings className="mr-2" /> Settings
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6">
          <ProfileSettings profile={profile} onUpdate={fetchProfile} />
        </Card>

        <Card className="p-4 sm:p-6">
          <ApiKeySettings profile={profile} onUpdate={fetchProfile} />
        </Card>

        <Card className="p-4 sm:p-6">
          <DangerZone profile={profile} />
        </Card>
      </div>
    </div>
  )
}