import { supabase } from '@/lib/supabase'
import { generateApiKey } from './api-key'

export async function regenerateUserKey(userId: string): Promise<{ data: { user_key: string } | null, error: Error | null }> {
  try {
    const newKey = generateApiKey()

    // First, delete the existing key
    const { error: deleteError } = await supabase
      .from('profile')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      throw deleteError
    }

    // Then, insert the new key
    const { data, error: insertError } = await supabase
      .from('profile')
      .insert([
        {
          user_id: userId,
          user_key: newKey
        }
      ])
      .select('user_key')
      .single()

    if (insertError) {
      throw insertError
    }

    return { data, error: null }
  } catch (error) {
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An unknown error occurred') 
    }
  }
}