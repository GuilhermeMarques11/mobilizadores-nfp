import { createClient } from '@/lib/supabase/server';
import { BanknoteArrowUp, CircleCheckBig, Clock, Users } from 'lucide-react';

export default async function MetricsGrid() {
  const supabase = await createClient();
  const { data: cpfs } = await supabase.from('cpfs').select('*');
  const approvedCpfs = cpfs?.filter((cpf) => cpf.cpf_status === 'APPROVED');
  const pendingCpfs = cpfs?.filter((cpf) => cpf.cpf_status === 'PENDING');

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
        <span className="grid w-9 h-9 place-items-center rounded-full bg-[#6b6b38]/15 text-[#6b6b38]">
          <Users className="w-5 h-5" />
        </span>
        <p className="mt-3 text-sm text-gray-600">CPFs Cadastrados</p>
        <p className="text-2xl font-extrabold text-[#2f2f17]">{cpfs?.length}</p>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
        <span className="grid w-9 h-9 place-items-center rounded-full bg-[#4EA668]/20 text-[#2F7A47]">
          <CircleCheckBig className="w-5 h-5" />
        </span>
        <p className="mt-3 text-sm text-gray-600">Validados</p>
        <p className="text-2xl font-extrabold text-[#2f2f17]">
          {approvedCpfs?.length}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
        <span className="grid w-9 h-9 place-items-center rounded-full bg-[#E5A823]/25 ext-[#8A6208]">
          <Clock className="w-5 h-5" />
        </span>
        <p className="mt-3 text-sm text-gray-600">Pendentes</p>
        <p className="text-2xl font-extrabold text-[#2f2f17]">
          {pendingCpfs?.length}
        </p>
      </div>

      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
        <span className="grid w-9 h-9 place-items-center rounded-full bg-[#E5A823]/25 ext-[#8A6208]">
          <BanknoteArrowUp className="w-5 h-5" />
        </span>
        <p className="mt-3 text-sm text-gray-600">A receber</p>
        <p className="text-2xl font-extrabold text-[#2f2f17]">R$ -</p>
      </div>
    </section>
  );
}
