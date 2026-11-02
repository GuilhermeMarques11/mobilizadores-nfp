'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { useTransition } from 'react';
import { Loader } from 'lucide-react';

interface ButtonFilterProps {
  statusValue: string;
  label: string;
}

export default function ButtonFilter({
  statusValue,
  label,
}: ButtonFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Verifica se o botão está atualmente selecionado a useImperativeHandle(
  const currentStatus = searchParams.get('status') || '';
  const isActive =
    currentStatus === statusValue || (!currentStatus && statusValue === '');

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (statusValue) {
      params.set('status', statusValue);
    } else {
      params.delete('status'); // Se for todos, removemos o parâmetro da URL
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className={`rounded-full border px-4 py-1.5 text-sm font-bold transition  cursor-pointer ${isActive ? 'bg-[#6b6b38] text-white' : 'bg-white border-[#E5E7EB] text-gray-700 hover:bg-[#6B6B38]/10'}`}
    >
      {label} {isPending && <Loader className="animate-spin" />}
    </Button>
  );
}
