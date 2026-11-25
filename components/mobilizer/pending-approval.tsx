'use client';

import { Clock, RotateCcw } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export default function PendingApproval() {
  const router = useRouter();

  const handleClick = () => {
    router.refresh();
  };
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <span className="w-16 h-16 grid mx-auto place-items-center rounded-full bg-[#e5a823]/20 p-1">
          <Clock className="w-8 h-8 " />
        </span>
        <span className="mt-4 inline-block rounded-full bg-[#E5A823] px-3 py-1 text-sm font-extrabold text-[#3D2C00] max-w-40 mx-auto">
          Em análise
        </span>
        <CardTitle className="mt-3 text-2xl font-extrabold text-[#4a4a25]">
          Cadastro recebido
        </CardTitle>
        <CardDescription className="mt-2 text-base leading-relaxed text-gray-600">
          Recebemos seu cadastro! A equipe da ABBA Brasil está revisando suas
          informações. Em breve você receberá a liberação da sua conta.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          onClick={handleClick}
          className="bg-primary mx-auto cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          Verificar status
        </Button>
      </CardFooter>
    </Card>
  );
}
