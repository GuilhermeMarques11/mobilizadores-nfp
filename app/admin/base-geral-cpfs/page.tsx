import GeneralCpfList from '@/components/admin/cpf-list/general-cpf-list';

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string; showCpfs?: string }>;
}

export default function GeneralCpfsDatabase({ searchParams }: PageProps) {
  return (
    <main>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-950">
          Base geral de CPFs
        </h1>
        <p className="mt-1 text-gray-600">
          Todos os CPFs cadastrados pelos mobilizadores.
        </p>
      </div>
      <GeneralCpfList searchParams={searchParams} />
    </main>
  );
}
