import AccountRejected from '@/components/dashboard/account-rejected';
import FullDashboard from '@/components/dashboard/full-dashboard';
import PendingApproval from '@/components/dashboard/pending-approval';
import TermsSignature from '@/components/dashboard/terms-signature';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';

export const instant = false;

export default async function DashboardPage() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Usuário não autenticado.</p>;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('status, full_name')
    .eq('id', user.id);

  if (error) {
    return <p>Erro ao carregar dados do usuário.</p>;
  }

  const userData = data[0];

  if (!userData?.full_name) {
    return <p>Nome do usuário não encontrado.</p>;
  }

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-6 sm:items-center sm:py-10 bg-[#F9F8F3]">
      {userData.status === 'PENDING' && <PendingApproval />}

      {userData.status === 'APPROVED' && (
        <TermsSignature fullName={userData.full_name} />
      )}

      {userData.status === 'REJECTED' && <AccountRejected />}

      {userData.status === 'ACTIVE' && <FullDashboard />}
    </main>
  );
}
