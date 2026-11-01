import AdminSidebar from '@/components/admin/adminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import React from 'react';

export const instant = false;

export default async function AdminDashBoardLayout({
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
    <SidebarProvider>
      <AdminSidebar profile={profile} />
      <div className="flex-1 p-8">{children}</div>
    </SidebarProvider>
  );
}
