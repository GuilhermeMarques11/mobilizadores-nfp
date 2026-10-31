'use client';

import { FileUp, Heart, User } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
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

const items = [
  { title: 'Mobilizadores', url: '#', icon: User },
  { title: 'Motor NFP', url: '#', icon: FileUp },
];

export default function AdminSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-0 flex flex-col h-screen w-64 shrink-0 bg-[#6b6b38] text-white"
    >
      <SidebarHeader className="border-b border-white/10 px-4">
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    render={
                      <Link href={item.url} className="flex items-center gap-1">
                        <item.icon />
                        {!isCollapsed && (
                          <span className="font-medium text-sm">
                            {item.title}
                          </span>
                        )}
                      </Link>
                    }
                    className="hover:bg-white/10 hover:text-white active:bg-white/20 text-white transition-colors"
                  ></SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
