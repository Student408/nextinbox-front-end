import { supabase } from '@/lib/supabase';
import { Service, Template, Profile } from '@/types/automate';

/**
 * Fetches all required data for code generation
 */
export async function fetchCodeGenerationData(userId: string) {
  const [
    { data: servicesData, error: servicesError },
    { data: templatesData, error: templatesError },
    { data: profileData, error: profileError }
  ] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('templates')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('profile')
      .select('user_key')
      .eq('user_id', userId)
      .single()
  ]);

  if (servicesError) throw servicesError;
  if (templatesError) throw templatesError;
  if (profileError) throw profileError;

  return {
    services: (servicesData || []) as Service[],
    templates: (templatesData || []) as Template[],
    profile: profileData as Profile
  };
}