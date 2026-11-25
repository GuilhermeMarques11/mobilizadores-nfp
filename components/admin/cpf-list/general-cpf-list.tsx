import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';
import ButtonFilter from '../button-filter';
import ShowCpfsButton from '../single-mobilizer/show-cpfs-button';
import GeneralCpfItem from './general-cpf-item';
import SearchInput from '@/components/search-input';

interface GeneralCpfListProps {
  searchParams: Promise<{ q?: string; status?: string; showCpfs?: string }>;
}

export const instant = false;

export default async function GeneralCpfList({
  searchParams,
}: GeneralCpfListProps) {
  await connection();
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams?.q?.trim() || '';
  const statusFilter = resolvedParams?.status || '';
  const isVisible = resolvedParams?.showCpfs === 'true';

  const supabase = await createClient();

  // Contagem geral por status para os filtros
  const { data: allStatuses } = await supabase
    .from('cpfs')
    .select('cpf_status');

  const totalCount = allStatuses?.length ?? 0;
  const approvedCount =
    allStatuses?.filter((item) => item.cpf_status === 'APPROVED').length ?? 0;
  const pendingCount =
    allStatuses?.filter((item) => item.cpf_status === 'PENDING').length ?? 0;
  const rejectedCount =
    allStatuses?.filter((item) => item.cpf_status === 'REJECTED').length ?? 0;

  // Consulta principal da tabela
  let query = supabase
    .from('cpfs')
    .select('id, cpf, created_at, cpf_status, user_id, profiles(id, full_name)')
    .order('created_at', { ascending: false });

  if (statusFilter) {
    query = query.eq('cpf_status', statusFilter);
  }

  if (searchTerm) {
    const { data: matchingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .ilike('full_name', `%${searchTerm}%`);

    const profileIds = matchingProfiles?.map((p) => p.id) ?? [];

    if (profileIds.length > 0) {
      query = query.or(
        `cpf.ilike.%${searchTerm}%,user_id.in.(${profileIds.join(',')})`,
      );
    } else {
      query = query.ilike('cpf', `%${searchTerm}%`);
    }
  }

  const { data: cpfs } = await query;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ButtonFilter statusValue="" count={totalCount} label="Todos" />
          <ButtonFilter
            statusValue="APPROVED"
            count={approvedCount}
            label="Validado"
          />
          <ButtonFilter
            statusValue="PENDING"
            count={pendingCount}
            label="Em validação"
          />
          <ButtonFilter
            statusValue="REJECTED"
            count={rejectedCount}
            label="Inválido"
          />
        </div>

        <div className="flex items-center gap-2">
          <SearchInput placeholder="Buscar por mobilizador ou CPF" />
          <ShowCpfsButton />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-215">
          <thead className="border-b-2 border-amber-500 bg-[#f3f1e6]">
            <tr>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                CPF
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Mobilizador
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Data de envio
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Estado da validação
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e7eb]">
            {cpfs && cpfs.length > 0 ? (
              cpfs.map((item) => (
                <GeneralCpfItem
                  key={item.id}
                  cpfItem={item}
                  isVisible={isVisible}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-sm"
                >
                  Nenhum CPF encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
