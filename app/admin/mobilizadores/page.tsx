import MobilizerItem from '@/components/admin/painel/mobilizer-item';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';

export const instant = false;

export default async function MobilizersList() {
  await connection();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email, city, status, cpfs(id)')
    .eq('role', 'mobilizer');

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-950">
          Gestão de Mobilizadores
        </h1>
        <p className="mt-1 text-gray-600">
          Analise cadastros e acompanhe o status de cada mobilizador
        </p>
      </div>
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
            {profile?.map((item) => {
              const cpfsCount = item.cpfs ? item.cpfs.length : 0;

              return (
                <MobilizerItem
                  key={item.id}
                  profile={item}
                  cpfsCount={cpfsCount}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
