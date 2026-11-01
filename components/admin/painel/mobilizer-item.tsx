'use client';

import { Button } from '@/components/ui/button';
import { getInitials, statusName, statusStyles } from '@/lib/utils';
import {
  handleApproveUser,
  handleReconsiderUser,
  handleRejectedUser,
} from '@/services/user';
import { UserProps } from '@/types/user';
import { Check, Loader, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function MobilizerItem({
  profile,
  cpfsCount,
}: UserProps & { cpfsCount: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const nameInitials = getInitials(profile?.full_name);

  // Função para aprovar usuário
  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.id) return;

    startTransition(async () => {
      const res = await handleApproveUser(profile.id);

      if (res.success) {
        router.refresh();
      } else if (res.message) {
        alert(`Erro: ${res.message}`);
      }
    });
  };

  // Função para rejeitar usuário
  const handleRejectClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.id) return;

    if (!window.confirm('Tem certeza que deseja rejeitar este usuário?')) {
      return;
    }

    const res = await handleRejectedUser(profile.id);

    if (res.success) {
      router.refresh();
    } else if (res.message) {
      alert(`Erro: ${res.message}`);
    }
  };

  // Função para rejeitar usuário
  const handleReconsiderClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!profile.id) return;

    const res = await handleReconsiderUser(profile.id);

    if (res.success) {
      router.refresh();
    } else if (res.message) {
      alert(`Erro: ${res.message}`);
    }
  };

  // Função para redirecionar para a página de detalhes do mobilizador
  const handleRowClick = () => {
    if (profile?.id) {
      router.push(`/admin/mobilizadores/${profile?.id}`);
    }
  };

  return (
    <tr className="hover:bg-[#F9F8F3] cursor-pointer" onClick={handleRowClick}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#6B6B38]/15 text-sm font-extrabold text-[#4A4A25]">
            {nameInitials}
          </span>
          <div>
            <p className="font-bold text-gray-900">{profile?.full_name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700">{profile?.city}</td>
      <td className="px-4 py-3 text-right text-gray-700">{cpfsCount}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-extrabold ${statusStyles[profile?.status ?? '']}`}
        >
          {statusName[profile?.status ?? '']}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {profile.status === 'PENDING' ? (
            <>
              <Button
                onClick={handleApproveClick}
                className="inline-flex items-center justify-center gap-2 bg-[#E06138] text-white hover:bg-[#C8512B] cursor-pointer rounded-lg"
              >
                {isPending ? (
                  <Loader
                    className="h5
     w-5"
                  />
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Aprovar
                  </>
                )}
              </Button>

              <Button
                onClick={handleRejectClick}
                className="inline-flex items-center justify-center gap-2 bg-white border-red-200 text-red-700 hover:bg-red-50 cursor-pointer rounded-lg"
              >
                <X className="h-4 w-4" />
                Rejeitar
              </Button>
            </>
          ) : profile.status === 'REJECTED' ? (
            <Button
              onClick={handleReconsiderClick}
              className="inline-flex items-center justify-center gap-2 bg-white border-[#E5E7EB] text-gray-700 hover:bg-gray-50 cursor-pointer rounded-lg"
            >
              Reconsiderar
            </Button>
          ) : (
            <span className="text-sm text-gray-400">Sem ações pendentes</span>
          )}
        </div>
      </td>
    </tr>
  );
}
