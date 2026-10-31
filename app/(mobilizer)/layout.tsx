import HeaderMobilizer from '@/components/dashboard/header-mobilizer';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, email, role')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="flex min-h-full flex-col">
      <HeaderMobilizer profile={profile} />
      {children}
    </div>
  );
}
