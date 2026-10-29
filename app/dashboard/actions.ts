'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type SigninTermsState = {
  success: boolean;
  message: string;
};

export async function signinTerms(
  _previousState: SigninTermsState,
  formData: FormData,
): Promise<SigninTermsState> {
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
  const signature = formData.get('signature') as string;
  const termsAccepted = formData.get('termsAccepted');

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
  revalidatePath('/dashbard');

  return {
    success: true,
    message: 'Termos assinados com sucesso.',
  };
}
