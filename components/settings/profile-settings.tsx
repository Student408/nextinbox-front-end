'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { User } from 'lucide-react'

interface ProfileSettingsProps {
  profile: {
    user_id: string
    email: string | null
  } | null
  onUpdate: () => void
}

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')

  async function updateProfile() {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
      
      onUpdate()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF6C37]" />
        <h3 className="text-base sm:text-lg font-semibold">Profile Information</h3>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile?.email || ''}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <Button
          onClick={updateProfile}
          disabled={loading}
          className="w-full sm:w-auto bg-[#FF6C37] hover:bg-[#FF6C37]/90"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  )
}