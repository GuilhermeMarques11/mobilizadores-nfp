import AdminSidebar from '@/components/admin/adminSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default async function AdminDashBoardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}
