import { createClient } from '@/lib/supabase/client';

export async function handleApproveUser(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'APPROVED' })
    .eq('id', id);

  if (error) {
    console.error('Erro ao aprovar usuário:', error.message);
    return { succes: false, message: error.message };
  }
  return { success: true, message: 'Usuário aprovado.' };
}
