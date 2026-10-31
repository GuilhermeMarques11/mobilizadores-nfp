'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type LoginState = {
  success: boolean;
  message: string | null;
};

export async function login(
  _previousState: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    return {
      success: false,
      message: error?.message || 'E-mail e senha são obrigatórios.',
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  const userRole = profile?.role;

  if (userRole === 'admin') {
    redirect('/admin/painel');
  } else {
    redirect('/painel');
  }
}
