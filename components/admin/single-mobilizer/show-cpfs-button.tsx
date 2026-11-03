'use client';

import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function ShowCpfsButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isShowing = searchParams.get('showCpfs') === 'true';
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (isShowing) {
      params.delete('showCpfs');
    } else {
      params.set('showCpfs', 'true');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-1.5 text-sm font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
    >
      {isShowing ? (
        <>
          <EyeOff className="h-4 w-4" />
          Ocultar CPFs
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          Exibir Cpfs
        </>
      )}
      {isPending && <Loader className="animate-spin" />}
    </Button>
  );
}
