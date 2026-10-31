'use client';

import { registerCpf } from '@/app/(mobilizer)/painel/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { maskCpf } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { ChangeEvent, useActionState, useState } from 'react';

export default function RegisterCpf() {
  const [state, formAction, isPending] = useActionState(registerCpf, null);
  const [cpf, setCpf] = useState('');

  const handleChangeCpf = (e: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCpf(e.target.value);
    setCpf(maskedValue);
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="w-full h-14 flex items-center justify-center gap-2 bg-[#E06138] cursor-pointer text-lg font-extrabold shadow-sm transition border-0 hover:bg-[#C8512B]">
            <Plus className="w-5 h-5" />
            Cadastrar novo CPF
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-[#4a4a25]">
            Cadastrar novo CPF
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-gray-600">
            Informe o CPF de quem vai doar através a Nota Fiscal Paulista da
            ABBA.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="mt-4 space-y-1.5">
          <Label
            htmlFor="cpf"
            className="block text-sm font-semibold text-shadow-gray-800"
          >
            CPF
          </Label>
          <Input
            id="cpf"
            name="cpf"
            value={cpf}
            required
            placeholder="000.000.000-00"
            onChange={handleChangeCpf}
            maxLength={14}
            className="w-full h-12 rounded-lg border bg-white px-3 text-lg text-gray-900 outline-none"
          />
          <Button
            type="submit"
            disabled={!cpf}
            className="mt-4 w-full h-12 flex items-center justify-center font-extrabold cursor-pointer bg-[#E06138] text-white hover:bg-[#C8512B]"
          >
            {isPending ? 'Cadastrando...' : 'Cadastrar CPF'}
          </Button>
          {state?.message && (
            <p className={state.success ? 'text-green-600' : 'text-red-600'}>
              {state.message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
