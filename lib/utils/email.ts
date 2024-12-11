import { supabase } from '@/lib/supabase'

const API_URL = process.env.NEXT_PUBLIC_NEXTINBOX_API_URL as string
const BATCH_SIZE = 5 // Process 50 emails at a time

interface EmailRequest {
  email_address: string
  name: string
  parameters: Record<string, string>
}

export async function sendEmails({
  serviceId,
  templateId,
  recipients,
  onProgress,
}: {
  serviceId: string
  templateId: string
  recipients: EmailRequest[]
  onProgress: (progress: number) => void
}): Promise<void> {
  // Get user key
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data: profileData, error: profileError } = await supabase
    .from('profile')
    .select('user_key')
    .eq('user_id', user.id)
    .single()

  if (profileError) throw profileError
  const userKey = profileData.user_key

  // Process in batches
  const batches = []
  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    batches.push(recipients.slice(i, i + BATCH_SIZE))
  }

  let processedCount = 0
  for (const batch of batches) {
    try {
      const response = await fetch(`${API_URL}/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_key: userKey,
          service_id: serviceId,
          template_id: templateId,
          recipients: batch
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      processedCount += batch.length
      onProgress((processedCount / recipients.length) * 100)

      // Add a small delay between batches to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error sending batch:', error)
      throw error
    }
  }
}