import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function deleteUserAccount(userId: string): Promise<{ error: Error | null }> {
  try {
    // Start a transaction by deleting related data first
    // Profile deletion is handled by CASCADE
    const { error: servicesError } = await supabase
      .from('services')
      .delete()
      .eq('user_id', userId)

    if (servicesError) throw servicesError

    const { error: templatesError } = await supabase
      .from('templates')
      .delete()
      .eq('user_id', userId)

    if (templatesError) throw templatesError

    const { error: logsError } = await supabase
      .from('logs')
      .delete()
      .eq('user_id', userId)

    if (logsError) throw logsError

    const { error: emailsError } = await supabase
      .from('emails')
      .delete()
      .eq('user_id', userId)

    if (emailsError) throw emailsError

    const { error: profileError } = await supabase
      .from('profile')
      .delete()
      .eq('user_id', userId)

    if (profileError) throw profileError

    // Delete the user from auth.users using admin client
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(
      userId
    )

    if (deleteUserError) throw deleteUserError

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw signOutError

    return { error: null }
  } catch (error) {
    console.error('Error deleting user account:', error)
    return {
      error: error instanceof Error ? error : new Error('An unknown error occurred')
    }
  }
}