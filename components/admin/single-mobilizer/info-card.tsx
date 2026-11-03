import { connection } from 'next/server';
import InfoCardGrid from './info-card-grid';
import InfoCardHeader from './info-card-header';
import { createClient } from '@/lib/supabase/server';

interface InfoCardProps {
  id: string;
}

export default async function InfoCard({ id }: InfoCardProps) {
  await connection();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, status, email, phone, city, created_at')
    .eq('id', id)
    .single();

  if (!profile) {
    return <p className="text-gray-500">Mobilizador não encontrado.</p>;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <InfoCardHeader full_name={profile.full_name} status={profile.status} />
      <InfoCardGrid
        email={profile.email}
        phone={profile.phone}
        city={profile.city}
        created_at={profile.created_at}
      />
    </section>
  );
}
