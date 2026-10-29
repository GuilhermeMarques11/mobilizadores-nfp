# Mobilizadores NFP

Plataforma de  gestão e acesso restrito para mobilizadores do programa Nota Fiscal Paulista.

## Tecnologias
- **Framework:** Next.js 16
- **Backend & Auth:** Supabase (SSR, RLS e Triggers)
- **Estilização:** Tailwind CSS & Shadcn/UI
- **Linguagem:** TypeScript
- **Gerenciamento de Formulários:** Server Actions & useActionState

## Funcionalidades do Sistema
- Autenticação e proteção de rotas via Middleware.
- Controle de acesso por status ('PENDING', 'APPROVED', 'ACTIVE', 'REJECTED').
- Validação e assinatura digital de termos de adesão antes da liberação do Dashboard completo para os Mobilizadores.
- Acesso de Administrador para gestão dos mobilizadores, CPFs cadastrados e repasses de comissões.
- Dashboard restrito para Administradores
