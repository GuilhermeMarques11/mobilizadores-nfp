'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type SignupState = {
  success: boolean;
  message: string;
};

export async function signup(
  _previousState: SignupState | null,
  formData: FormData,
): Promise<SignupState> {
  const supabase = await createClient();

  // Extrai os campos do formulário
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const city = formData.get('city') as string;

  // Chama o Supabase Auth passando os dados extras na chave options.data
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        city,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // Se o cadastro for bem sucedido, redirecionamos para a página do painel
  redirect('/dashboard');
}
