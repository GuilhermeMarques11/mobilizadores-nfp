import { createClient } from '@/lib/supabase/server';
import CpfListItem from './cpf-list-item';
import { connection } from 'next/server';
import ShowCpfsButton from './show-cpfs-button';

interface CpfListTableProps {
  id: string;
  searchParams: Promise<{ showCpfs?: string }>;
}

export default async function CpfListTable({
  id,
  searchParams,
}: CpfListTableProps) {
  const resolvedParams = await searchParams;
  const isVisible = resolvedParams?.showCpfs === 'true';
  await connection();
  const supabase = await createClient();
  const { data: cpfs } = await supabase
    .from('cpfs')
    .select('cpf, created_at, cpf_status, id, user_id')
    .eq('user_id', id);

  if (!cpfs) {
    return <p className="text-gray-500">Nenhum CPF encontrado.</p>;
  }

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
        <h2 className="text-lg font-extrabold">CPFs do mobilizador</h2>
        {cpfs.length > 0 && <ShowCpfsButton />}
      </div>
      <table className="w-full">
        <thead className="border-y-2 border-y-[#E5A823]/0 border-b[#E5A823] bg-[#F3F1E6]">
          <tr>
            <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
              CPF
            </th>
            <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
              Data de cadastro
            </th>
            <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {cpfs.length > 0 ? (
            cpfs.map((cpf) => (
              <CpfListItem
                key={cpf.id}
                cpf={cpf.cpf}
                created_at={cpf.created_at}
                cpf_status={cpf.cpf_status}
                isVisible={isVisible}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="py-8 text-center text-gray-500 text-sm"
              >
                Este mobilizador ainda não cadastrou nenhum CPF.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
