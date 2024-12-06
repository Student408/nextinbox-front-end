import { supabase } from '@/lib/supabase'

export async function deleteUserAccount(userId: string): Promise<{ error: Error | null }> {
  try {
    // Delete the profile first (this will cascade delete related data)
    const { error: profileError } = await supabase
      .from('profile')
      .delete()
      .eq('user_id', userId)

    if (profileError) throw profileError

    // Delete the user's auth account
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError

    return { error: null }
  } catch (error) {
    return { 
      error: error instanceof Error ? error : new Error('An unknown error occurred') 
    }
  }
}