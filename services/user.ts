import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

/******************
Função para aprovar usuário
 ******************/
export async function handleApproveUser(id: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'APPROVED' })
    .eq('id', id);

  if (error) {
    console.error('Erro ao aprovar usuário:', error.message);
    return { success: false, message: error.message };
  }
  return { success: true, message: 'Usuário aprovado.' };
}

/******************
Função para rejeitar usuário
 ******************/
export async function handleRejectedUser(id: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'REJECTED' })
    .eq('id', id);

  if (error) {
    console.error('Erro ao rejeitar usuário:', error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Usuário rejeitado.' };
}

/******************
Função para reconsiderar usuário alterando o status para "PENDING"
 ******************/
export async function handleReconsiderUser(id: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'PENDING' })
    .eq('id', id);

  if (error) {
    console.error('Erro ao reconsiderar usuário:', error.message);
    return { success: false, message: error.message };
  }
  return { success: true, message: 'Usuário reconsiderado.' };
}
