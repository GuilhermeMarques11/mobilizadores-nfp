'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/entrar');
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="flex justify-start items-center gap-2 h-11 w-full rounded-xl text-left text-red-700 cursor-pointer pl-0"
    >
      <LogOut className="w-6 h-6" />
      Sair
    </Button>
  );
}
