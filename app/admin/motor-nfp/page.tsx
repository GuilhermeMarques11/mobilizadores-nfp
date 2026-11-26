import { NfpClient } from '@/components/admin/motor-nfp/nfp-client';
import { NfpBaseCpfRecord } from '@/lib/nfp-engine';
import { createClient } from '@/lib/supabase/server';
import { connection } from 'next/server';

export const instant = false;

export default async function NfpMotorPage() {
  await connection();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('cpfs')
    .select(
      `
    id,
    cpf,
    cpf_status,
    user_id,
    profiles(
    id,
    full_name
    )
    `,
    )
    .order('cpf', { ascending: true });

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">
          Erro ao carregar base de CPFs: {error.message}
        </p>
      </div>
    );
  }

  const baseRecords = (data ?? []) as NfpBaseCpfRecord[];

  return (
    <main>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-950">Motor NFP</h1>
        <p className="mt-1 text-gray-600">
          Envie os arquivos da Nota Fiscal Paulista e calcule os créditos e
          repasses do mês.
        </p>
      </div>
      <NfpClient baseRecords={baseRecords} />
    </main>
  );
}
