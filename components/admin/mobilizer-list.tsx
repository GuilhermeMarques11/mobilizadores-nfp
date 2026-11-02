import MobilizerItem from '@/components/admin/mobilizer-item';
import { createClient } from '@/lib/supabase/server';
import MobilizerFilters from './mobilzer-filters';
import { connection } from 'next/server';

interface MobilizerListProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export const instant = false;

export default async function MobilizerList({
  searchParams,
}: MobilizerListProps) {
  await connection();
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams?.q || '';
  const statusFilter = resolvedParams?.status || '';

  const supabase = await createClient();

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, city, status, created_at, cpfs(id)')
    .eq('role', 'mobilizer');

  if (searchTerm) {
    query = query.or(
      `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%`,
    );
  }

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  const { data: profile } = await query;

  return (
    <>
      <MobilizerFilters />
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-215">
          <thead className="border-b-2 border-amber-500 bg-[#F3F1E6]">
            <tr>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Mobilizador
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Cidade
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Cadastro
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-right">
                CPFs
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-left">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-bold text-gray-600 text-right">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {profile && profile.length > 0 ? (
              profile?.map((item) => {
                const cpfsCount = item.cpfs ? item.cpfs.length : 0;

                return (
                  <MobilizerItem
                    key={item.id}
                    profile={item}
                    cpfsCount={cpfsCount}
                  />
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-gray-500 text-sm"
                >
                  Nenhum mobilizador encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
