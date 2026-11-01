'use client';

import {
  FileUp,
  Heart,
  LayoutDashboard,
  LogOut,
  User2,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '../ui/sidebar';
import Link from 'next/link';
import { UserProps } from '@/types/user';
import { Button } from '../ui/button';
import { handleSignOut } from '@/services/auth';
import { getInitials } from '@/lib/utils';

const items = [
  { title: 'Painel', url: '/admin/painel', icon: LayoutDashboard },
  { title: 'Mobilizadores', url: '/admin/mobilizadores', icon: Users },
  { title: 'Motor NFP', url: '/admin/motor-nfp', icon: FileUp },
];

export default function AdminSidebar({ profile }: UserProps) {
  const fullName = profile?.full_name;
  const firsTwoNames = fullName?.split(' ').slice(0, 2).join(' ');
  const nameInitials = getInitials(fullName);
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-0 flex flex-col h-screen w-64 shrink-0 bg-[#6b6b38] text-white"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between py-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden transition-all">
              <span className="h-11 w-11 grid place-items-center rounded-full bg-white/15">
                <Heart className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xl font-extrabold">ABBA Brasil</p>
              </div>
            </div>
          )}

          <SidebarTrigger className="text-whwite hover:bg-white/10 ml-auto" />
        </div>
      </SidebarHeader>
      <div className="mx-5 h-0.5 bg-[#e5a823]"></div>
      <SidebarContent className="mt-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="py-1">
                  <SidebarMenuButton
                    render={
                      <Link href={item.url} className="flex items-center gap-1">
                        <item.icon className="h-5! w-5!" />
                        {!isCollapsed && (
                          <span className="text-[18px]">{item.title}</span>
                        )}
                      </Link>
                    }
                    className="h-10 relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left font-bold transition text-white/80 hover:bg-white/10 hover:text-white"
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-white/15 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#E5A823] text-sm font-extrabold text-[#3D2C00]">
              {nameInitials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{firsTwoNames}</p>
              <p className="text-xs text-white">{profile?.role}</p>
            </div>
            <Button
              aria-label="sair"
              onClick={handleSignOut}
              variant="ghost"
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
