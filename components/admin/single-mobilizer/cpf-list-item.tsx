import { formatCpf, statusName, statusStyles } from '@/lib/utils';
import { CpfType } from '@/types/cpf';

type CpfListItemProps = Pick<CpfType, 'cpf' | 'cpf_status' | 'created_at'> & {
  isVisible: boolean;
};

export default function CpfListItem({
  cpf,
  created_at,
  cpf_status,
  isVisible,
}: CpfListItemProps) {
  return (
    <tr className="hover:bg-[#F9F8F3]">
      <td className="px-4 py-2.5 font-bold text-gray-900">
        {formatCpf(cpf, isVisible)}
      </td>
      <td className="px-4 py-2.5 font-bold text-gray-900">
        {new Date(created_at).toLocaleDateString('pt-BR')}
      </td>
      <td className="px-4 py-2.5 font-bold">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold bg-[#E5A823] text-[#3D2C00] ${statusStyles[cpf_status]}`}
        >
          {statusName[cpf_status]}
        </span>
      </td>
    </tr>
  );
}
