import { getInitials, statusName, statusStyles } from '@/lib/utils';
import { UserProps } from '@/types/user';

type InfoCardHeaderProps = Pick<UserProps['profile'], 'full_name' | 'status'>;

export default function InfoCardHeader({
  full_name,
  status,
}: InfoCardHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-6">
      <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#6B6B38] text-xl font-extrabold text-white">
        {getInitials(full_name)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold">{full_name}</h1>
          <span
            className={`inline-block rounded-full font-extrabold bg-[#4EA668]/20 text-[#1F6B3A] px-3 py-1 text-sm ${statusStyles[status]}`}
          >
            {statusName[status] || 'Desconhecido'}
          </span>
        </div>
        {status === 'APPROVED' ? (
          <p className="mt-1 text-yellow-600">
            Assinatura de contrato pendente
          </p>
        ) : status === 'ACTIVE' ? (
          <p className="mt-1 text-gray-600">Mobilizador ativo</p>
        ) : status === 'REJECTED' ? (
          <p className="mt-1 text-red-600">Mobilizador rejeitado</p>
        ) : status === 'PENDING' ? (
          <p className="mt-1 text-yellow-600">Aguardando aprovação</p>
        ) : null}
      </div>
    </div>
  );
}
