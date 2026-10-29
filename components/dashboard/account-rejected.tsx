import { CircleAlert, MessageCircle } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function AccountRejected() {
  return (
    <Card className="w-full max-w-md mx-auto text-center bg-[#fcefe9] p-6">
      <CardHeader>
        <span className="w-16 h-16 grid mx-auto place-items-center rounded-full text-[#c8512b] bg-[#e06138]/15 p-1">
          <CircleAlert className="w-8 h-8" />
        </span>
        <CardTitle className="mt-4 text-2xl font-extrabold text-[6b2e14]">
          Solicitação não aprovada
        </CardTitle>
      </CardHeader>
      <CardDescription>
        Sua solicitação não foi aprovada no momento. Isso pode acontecer quando
        há informações incompletas ou divergentes. Fale cm a equipe da ABBA para
        entender o motivo e tentar novamente.
      </CardDescription>
      <CardFooter>
        <Link
          href="https://wa.me/5511999999999"
          target="_blank"
          className="w-full"
        >
          <Button className="w-full h-12 flex items-center justify-center gap-2 cursor-pointer bg-[#6b6b38]">
            <MessageCircle className="w-4 h-4" />
            Falar com a equipe da ABBA
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
