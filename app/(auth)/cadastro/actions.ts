'use server';

import { createClient } from '@/lib/supabase/server';
import { unMask } from '@/lib/utils';
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
  const cpf = formData.get('userCpf') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;
  const city = formData.get('city') as string;

  const cleanCpf = unMask(cpf);
  const cleanPhone = unMask(phone);

  const { data: cpfExists } = await supabase.rpc('check_cpf_exists', {
    p_cpf: cleanCpf,
  });

  if (cpfExists) {
    console.log('LOG: CPF já existe na base de dados!');
    return {
      success: false,
      message: 'Este CPF já está cadastrado no sistema.',
    };
  }

  // Chama o Supabase Auth passando os dados extras na chave options.data
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: cleanPhone,
        city,
        cpf: cleanCpf,
      },
    },
  });

  if (error) {
    console.log('LOG: Erro no Supabase Auth:', error.message);
    if (error.message.includes('already registered') || error.status === 422) {
      return {
        success: false,
        message: 'Este e-mail já sendo usado.',
      };
    }
    return {
      success: false,
      message: error.message,
    };
  }

  console.log('LOG: Cadastro bem-sucedido, redirecionando...');
  // Se o cadastro for bem sucedido, redirecionamos para a página do painel
  redirect('/painel');
}
