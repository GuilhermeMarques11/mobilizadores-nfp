import Link from 'next/link';
import SignOutButton from '../signout-button';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, LayoutDashboardIcon, User } from 'lucide-react';

interface HeaderProps {
  profile: {
    full_name: string | null;
    email: string;
  } | null;
}
export default function HeaderMobilizer({ profile }: HeaderProps) {
  const fullName = profile?.full_name;
  const firstName = fullName?.split(' ')[0];
  const nameInitials = fullName
    ?.trim()
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
  return (
    <header className="bg-primary py-2">
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="text-primary-foreground">
          <h1>ABBA Brasil</h1>
          <p>Mobilizadores</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-11 flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 text-white transition hover:bg-white/25 hover:text-white cursor-pointer"
              >
                <span className="h-9 w-9 grid place-items-center rounded-full bg-[#e5a823] text-sm font-extrabold text-[#3d2c00]">
                  {nameInitials}
                </span>
                <span className="text-sm font-bold">{firstName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-full" align="start">
            <DropdownMenuGroup>
              <div className="px-3 py-2">
                <p className="font-extrabold text-[#4a4a25]">
                  {profile?.full_name}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {profile?.email}
                </p>
              </div>
              <div className="my-1 h-px bg-[#e5e7eb]"></div>
              <DropdownMenuItem>
                <Link
                  href="/painel"
                  className="flex items-center gap-2 h-11 w-full rounded-xl text-left"
                >
                  <LayoutDashboardIcon className="w-6 h-6 text-[#6B6B38]" />
                  Painel
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="/perfil"
                  className="flex items-center gap-2 h-11 w-full rounded-xl text-left"
                >
                  <User className="w-6 h-6 text-[#6B6B38]" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
