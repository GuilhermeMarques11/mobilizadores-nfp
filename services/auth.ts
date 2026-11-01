import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';

export async function handleSignOut() {
  const supabase = createClient();
  await supabase.auth.signOut();

  redirect('/entrar');
}
