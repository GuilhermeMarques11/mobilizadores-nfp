'use client';
import { signup, SignupState } from '@/app/(auth)/cadastro/actions';
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
import { useActionState, useState } from 'react';
import { Loader } from 'lucide-react';
import Link from 'next/link';

export default function SignupForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordMatch = password === confirmPassword;
  const [state, formAction, isPending] = useActionState<
    SignupState | null,
    FormData
  >(signup, null);
  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Seja um Mobilizador ABBA</CardTitle>
          <CardDescription>
            Ajude a transforma vidas através da Nota Fiscal Paulista
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" type="text" name="fullName" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" name="email" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="phone">Telefone (Whatsapp)</Label>
                  <Input id="phone" type="tel" name="phone" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" type="text" name="city" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    name="confirm-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {confirmPassword && !passwordMatch && (
                    <p className="text-red-600">As senhas não coincidem</p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground cursor-pointer flex items-center gap-1"
                disabled={!password || !passwordMatch}
              >
                Criar minha conta
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
        Já é um mobilizador?{' '}
        <Link href="/login" className="text-[#007399]">
          Entrar
        </Link>
      </p>
    </>
  );
}
