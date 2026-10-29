'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="cursor-pointer"
    >
      Sair
    </Button>
  );
}
