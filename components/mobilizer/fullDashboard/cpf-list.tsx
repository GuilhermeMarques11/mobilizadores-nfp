import { createClient } from '@/lib/supabase/server';

import CpfItem from './cpf-item';

export default async function CpfList() {
  const supabase = await createClient();
  const { data: cpfs } = await supabase.from('cpfs').select('*');

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm p-4">
      <div className="p-4">
        {cpfs && cpfs?.length > 0 ? (
          <div>
            <p className="mt-3 text-sm text-gray-500">
              {cpfs.length} CPFs cadastrados
            </p>
            <ul className="mt-2 divide-y divide-[#E5E7EB]">
              {cpfs.map((cpf) => (
                <CpfItem
                  id={cpf.id}
                  cpf={cpf.cpf}
                  cpf_status={cpf.cpf_status}
                  created_at={cpf.created_at}
                  key={cpf.id}
                />
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm text-gray-500">Nenhum CPF Cadastrado.</p>
        )}
      </div>
    </section>
  );
}
