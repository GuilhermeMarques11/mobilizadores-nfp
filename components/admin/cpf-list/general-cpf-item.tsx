'use client';

import { Button } from '@/components/ui/button';
import { formatCpf, statusName, statusStyles } from '@/lib/utils';
import { handleApproveCpf, handleRejectCpf } from '@/services/cpf';
import { CpfType } from '@/types/cpf';
import { Check, Loader, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

interface GeneralCpfItemProps {
  cpfItem: CpfType;
  isVisible: boolean;
}

export default function GeneralCpfItem({
  cpfItem,
  isVisible,
}: GeneralCpfItemProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    'approve' | 'reject' | 'null'
  >();
  const profileObj = Array.isArray(cpfItem.profiles)
    ? cpfItem.profiles[0]
    : cpfItem.profiles;

  const mobilizerName = profileObj?.full_name || 'Mobilizador sem nome';
  const mobilizerId = profileObj?.id || cpfItem.user_id;

  const handleValidateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cpfItem.id) return;

    setPendingAction('approve');
    startTransition(async () => {
      const res = await handleApproveCpf(cpfItem.id);
      setPendingAction('null');

      if (res.success) {
        router.refresh();
      } else if (res.message) {
        alert(`Erro: ${res.message}`);
      }
    });
  };

  const handleInvalidateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cpfItem.id) return;

    if (!window.confirm('Tem certeza que deseja invalidar este CPF?')) {
      return;
    }

    setPendingAction('reject');
    startTransition(async () => {
      const res = await handleRejectCpf(cpfItem.id);
      setPendingAction('null');

      if (res.success) {
        router.refresh();
      } else if (res.message) {
        alert(`Erro: ${res.message}`);
      }
    });
  };

  return (
    <tr className="hover:bg-gray-50/70 transition-colors">
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
        {formatCpf(cpfItem.cpf, isVisible)}
      </td>

      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
        <Link href={`/admin/mobilizadores/${mobilizerId}`}>
          {mobilizerName}
        </Link>
      </td>

      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
        {new Date(cpfItem.created_at).toLocaleDateString('pt-br')}
      </td>

      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold bg-[#E5A823] text-[#3D2C00] ${statusStyles[cpfItem.cpf_status]}`}
        >
          {statusName[cpfItem.cpf_status]}
        </span>
      </td>

      <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
        {cpfItem.cpf_status === 'PENDING' ? (
          <div className="inline-flex items-center justify-end gap-2">
            <Button
              type="button"
              disabled={isPending}
              onClick={handleValidateClick}
              className="inline-flex items-center justify-center gap-2 bg-[#E06138] text-white hover:bg-[#C8512B] cursor-pointer rounded-lg"
            >
              {isPending && pendingAction === 'approve' ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Validar
                </>
              )}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={handleInvalidateClick}
              className="inline-flex items-center justify-center gap-2 bg-white border-red-200 text-red-700 hover:bg-red-50 cursor-pointer rounded-lg"
            >
              {isPending && pendingAction === 'reject' ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Invalidar
                </>
              )}
            </Button>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Sem ações pendentes</span>
        )}
      </td>
    </tr>
  );
}
