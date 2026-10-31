import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  // Executa a atualização de sessão padrão do Supabase
  const response = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  // Define quais rotas precisam de proteção
  const isMobilizerRoute =
    pathname.startsWith('/painel') || pathname.startsWith('/perfil');
  const isAdminRoute = pathname.startsWith('/admin');

  // Aplica a validação de permissão
  if (isMobilizerRoute || isAdminRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/entrar', request.url));
    }

    // Busca o perfil para verificar a role do utilizador
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role;

    // Regra para Admin: Se form admin, não pode acessar rotas de mobilizador (redirecionar para o /admin)
    if (userRole === 'admin' && isMobilizerRoute) {
      return NextResponse.redirect(new URL('/admin/painel', request.url));
    }

    // Regra para Mobilizador/Outros: Se tentar acessar a rota de admin sem ser admin, bloqueia
    if (userRole !== 'admin' && isAdminRoute) {
      return NextResponse.redirect(new URL('/entrar', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
