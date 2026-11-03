import InfoCard from '@/components/admin/single-mobilizer/info-card';
import CpfListTable from '@/components/admin/single-mobilizer/cpf-list-table';

interface SingleMobilizerPage {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ showCpfs?: string }>;
}

export default async function SingleMobilizerPage({
  params,
  searchParams,
}: SingleMobilizerPage) {
  const { id } = await params;

  return (
    <main>
      <div className="space-y-6">
        <InfoCard id={id} />
        <CpfListTable id={id} searchParams={searchParams} />
      </div>
    </main>
  );
}
