import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/use-toast'
import { AlertTriangle } from 'lucide-react'
import { deleteUserAccount } from '@/lib/utils/auth'

interface DangerZoneProps {
  profile: {
    user_id: string
  } | null
}

export function DangerZone({ profile }: DangerZoneProps) {
  const [loading, setLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()

  async function handleDeleteAccount() {
    if (!profile?.user_id) {
      toast({
        title: 'Error',
        description: 'User profile not found',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)
      const { error } = await deleteUserAccount(profile.user_id)

      if (error) throw error

      toast({
        title: 'Account Deleted',
        description: 'Your account has been successfully deleted',
      })

      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete account. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            disabled={loading}
          >
            Delete Account
          </Button>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}