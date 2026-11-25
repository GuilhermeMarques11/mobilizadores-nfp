import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

/******************
Função para validar/aprovar CPF
 ******************/
export async function handleApproveCpf(id: string) {
  const { data, error } = await supabase
    .from('cpfs')
    .update({ cpf_status: 'APPROVED' })
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erro ao validar CPF', error.message);
    return { success: false, message: error.message };
  }

  if (!data || data.length == 0) {
    return {
      success: false,
      message: 'Nenhum registro atualizado. Verifique as permissões. (RLS).',
    };
  }

  return { success: true, message: 'CPF validado.' };
}

/******************
Função para invalidar/rejeitar CPF
 ******************/
export async function handleRejectCpf(id: string) {
  const { error } = await supabase
    .from('cpfs')
    .update({ cpf_status: 'REJECTED' })
    .eq('id', id);

  if (error) {
    console.error('Erro ao invalidar CPF:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'CPF invalidado.' };
}
