'use client';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { login, LoginState } from '@/app/(auth)/login/actions';
import { useActionState } from 'react';
import { Loader } from 'lucide-react';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState<
    LoginState | null,
    FormData
  >(login, null);
  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Acesse sua conta de mobilizador</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="space-y-1">
                <Label htmlFor="loginEmail">E-mail</Label>
                <Input type="email" id="loginEmail" name="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="loginPassword">Senha</Label>
                <Input type="password" id="loginPassword" name="password" />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground cursor-pointer flex items-center gap-1"
              >
                Entrar
                {isPending && <Loader className="animate-spin" />}
              </Button>
              {state?.message && (
                <p className="text-red-600">{state.message}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4">
        Ainda não um mobilizador?{' '}
        <Link href="/cadastro" className="text-[#007399]">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}
