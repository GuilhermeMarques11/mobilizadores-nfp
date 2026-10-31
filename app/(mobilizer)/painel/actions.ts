'use server';

import { createClient } from '@/lib/supabase/server';
import { unMask } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export type ActionState = {
  success: boolean;
  message: string;
};

/** ****************************************************
 Form Action para aceite dos termos e assinatura do contrato
*******************************************************/
export async function signinTerms(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const signature = formData.get('signature') as string;
  const termsAccepted = formData.get('termsAccepted');

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: 'Usuário não autenticado.',
    };
  }

  if (!termsAccepted) {
    return {
      success: false,
      message: 'Você precisa aceitar os termos de contrato.',
    };
  }

  if (!signature || signature.trim() === '') {
    return {
      success: false,
      message: 'Por favor, digite seu nome completo para assinar o contrato.',
    };
  }

  // Buscar o perfil para validar o nome e garantir o status atual
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, status')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return {
      success: false,
      message: 'Perfil não encontrado',
    };
  }

  if (
    signature.trim().toLowerCase() !== profile.full_name.trim().toLowerCase()
  ) {
    return {
      success: false,
      message:
        'A assinatura deve ser exatamente igual ao seu nome completo cadastrado.',
    };
  }

  // Inserir o registro na tabela terms_signature
  const { error: insertError } = await supabase.from('terms_signature').insert({
    user_id: user.id,
    version: '1.0',
  });

  if (insertError) {
    return {
      success: false,
      message: 'Erro ao registrar assinatura. Tente novamente.',
    };
  }

  // Atualizar o status de APPROVED para ACTIVE na tabela profiles
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ status: 'ACTIVE' })
    .eq('id', user.id);

  if (updateError) {
    return {
      success: false,
      message: 'Erro ao atualizar o status da conta para ativo.',
    };
  }

  // Revalidar a rota do dashboard para refletir o novo estado de ACTIVE
  revalidatePath('/dashboard');

  return {
    success: true,
    message: 'Termos assinados com sucesso.',
  };
}

/** ****************************************************
 Form Action para registrar novo CPF
*******************************************************/
export async function registerCpf(
  _previousState: ActionState | null,
  formData: FormData,
) {
  const cpf = formData.get('cpf') as string;

  const cleanCpf = unMask(cpf);

  if (!cpf || cpf.trim() === '') {
    return { success: false, message: 'O CPF é obrigatório' };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  // Inserir o CPF na tabela 'cpfs' assioando ao id do usuário
  const { error: insertError } = await supabase.from('cpfs').insert([
    {
      cpf: cleanCpf.trim(),
      user_id: user.id,
      cpf_status: 'PENDING',
    },
  ]);

  if (insertError) {
    if (insertError.code === '23505') {
      return {
        success: false,
        message: 'Este CPF já se encontra registrado no sistema.',
      };
    }
    console.error('Erro ao inserir CPF:', insertError.message);
    return { success: false, message: 'Erro ao cadastrar o CPF.' };
  }

  revalidatePath('/dashboard');
  return { success: true, message: 'CPF cadastrado com sucesso.' };
}
