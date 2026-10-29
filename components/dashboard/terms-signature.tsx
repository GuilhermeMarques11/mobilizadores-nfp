'use client';

import { Check, Loader, Pencil } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useActionState } from 'react';
import { signinTerms, ActionState } from '@/app/dashboard/actions';

interface ContractSigning {
  fullName: string;
}

const initialState: ActionState = {
  success: false,
  message: '',
};

export default function TermsSignature({ fullName }: ContractSigning) {
  const [state, formAction, isPending] = useActionState(
    signinTerms,
    initialState,
  );
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6b6b38]/15 px-3 py-1 text-sm font-bold text-[#4a4a25] max-w-50">
          <Check className="w-4 h-4" />
          Cadastro aprovado
        </span>
        <CardTitle className="mt-3 text-xl font-extrabold text-[#4a4a25]">
          Falta só um passo
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-gray-600">
          Leia os termos e assine para liberar seu acesso.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="mt-4 space-y-4">
          <div
            role="region"
            aria-label="Termos de Adesão do Mobilizador NFP"
            className="max-h-56 overflow-y-auto rounded-lg border-2 border-[#6b6b38] bg-white p-4 text-sm leading-relaxed text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007399]"
          >
            <h2 className="mb-2 text-base font-extrabold text-[#4a4a25]">
              Termos de Adesão do Mobilizador
            </h2>
            <p>
              Pelo presente instrumento, a ABBA Brasil e {fullName} estabelecem
              parceria para divulgação e captação de CPFs junto ao programa Nota
              Fiscal Paulista, mediante repasse de comissão por CPF validado,
              nos termos e valores definidos pela ABBA para o ciclo vigente. O
              mobilizador declara estar de acordo com o tratamento dos dados
              pessoais coletados exclusivamente para essa finalidade, conforme a
              Lei Geral de Proteção de Dados.
            </p>
          </div>
          <div>
            <Label className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-700">
              <span className="relative mt-0.5 shrink-0">
                <Input
                  type="checkbox"
                  name="termsAccepted"
                  required
                  aria-invalid="false"
                  className="peer sr-only"
                />
                <span className="grid h-5 w-5 place-items-center rounded border-2 bg-white text-white transition peer-checked:border-[#e06138] peer-checked:bg-[#e06138] peer-checked:[&>svg]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-[#007399] peer-focus-visible:ring-offset-2 border-gray-300">
                  <Check className="w-3.5 h-3.5 opacity-0" />
                </span>
              </span>
              <span className="mt-0.5">
                Li e concordo com os termos do contrato acima.
              </span>
            </Label>
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="signature"
              className="block text-sm font-semibold text-gray-800"
            >
              Digite seu nome completo para assinar
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-2/4 -translate-y-1/2 text-gray-400">
                <Pencil className="w-4 h-4" />
              </span>
              <Input
                id="signature"
                name="signature"
                placeholder={fullName}
                required
                className="h-12 w-full rounded-lg border bg-white pl-10 pr-3 text-base text-gray-900 outline-none transition focus:border-[#007399] focus:ring-2 focus:ring-[#007399]/30 border-[#e5e7eb]"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-amber-600 cursor-pointer w-full flex items-center gap-1"
          >
            Assinar contrato
            {isPending && <Loader className="w-4 h-4 animate-spin" />}
          </Button>
          {state?.message && <p className="text-red-600">{state.message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
