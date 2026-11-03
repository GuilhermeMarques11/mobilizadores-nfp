'use client';
import { formatCpf, statusName, statusStyles } from '@/lib/utils';
import { CpfType } from '@/types/cpf';
import { Eye } from 'lucide-react';
import { useState } from 'react';

export default function CpfItem({ cpf, id, created_at, cpf_status }: CpfType) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <li key={id} className="flex items-center justify-between gap-3 py-3">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-gray-600">
            {formatCpf(cpf, isVisible)}
          </p>
          <Eye
            onClick={() => setIsVisible(!isVisible)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
        <p className="text-sm text-gray-500">
          Enviado em {new Date(created_at).toLocaleDateString('pt-BR')}
        </p>
      </div>
      <span
        className={`px-2 py-1 rounded text-xs font-semibold uppercase ${statusStyles[cpf_status] || 'bg-gray-100 text-gray-800'}`}
      >
        {statusName[cpf_status]}
      </span>
    </li>
  );
}
