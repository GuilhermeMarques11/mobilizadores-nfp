import Header from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

export const instant = false;

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div>
      <Header profile={profile} />
      {children}
    </div>
  );
}
