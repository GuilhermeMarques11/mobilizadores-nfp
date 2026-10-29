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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!email || !password) {
    return {
      success: false,
      message: 'E-mail e senha são obrigatórios.',
    };
  }

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // Se o login for feito com sucesso
  redirect('/dashboard');
}
