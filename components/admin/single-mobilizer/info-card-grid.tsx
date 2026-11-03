import { maskPhone } from '@/lib/utils';
import { UserProps } from '@/types/user';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

type InfoCardGridProps = Pick<
  UserProps['profile'],
  'email' | 'phone' | 'city' | 'created_at'
>;

export default function InfoCardGrid({
  email,
  phone,
  city,
  created_at,
}: InfoCardGridProps) {
  return (
    <dl className="grid grid-cols-2 gap-px border-t border-[#E5E7EB] bg-[#E5E7EB]">
      <Link
        href={`mailto:${email}`}
        className="flex items-start gap-3 bg-white px-6 py-3.5 hover:bg-[#F9F8F3]"
      >
        <span className="mt-0.5 text-[#6B6B38]">
          <Mail className="h-4 w-4" />
        </span>
        <div>
          <dt className="text-sm text-gray-500">E-mail</dt>
          <dd className="font-semibold text-gray-900">{email}</dd>
        </div>
      </Link>

      <Link
        href={`https://wa.me/${phone}`}
        target="_blank"
        className="flex items-start gap-3 bg-white px-6 py-3.5 hover:bg-[#F9F8F3]"
      >
        <span className="mt-0.5 text-[#6B6B38]">
          <Phone className="h-4 w-4" />
        </span>
        <div>
          <dt className="text-sm text-gray-500">Telefone</dt>
          <dd className="font-semibold text-gray-900">{maskPhone(phone)}</dd>
        </div>
      </Link>

      <div className="flex items-start gap-3 bg-white px-6 py-3.5 hover:bg-[#F9F8F3]">
        <span className="mt-0.5 text-[#6B6B38]">
          <MapPin className="h-4 w-4" />
        </span>
        <div>
          <dt className="text-sm text-gray-500">Cidade</dt>
          <dd className="font-semibold text-gray-900">{city}</dd>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-white px-6 py-3.5 hover:bg-[#F9F8F3]">
        <span className="mt-0.5 text-[#6B6B38]">
          <Calendar className="h-4 w-4" />
        </span>
        <div>
          <dt className="text-sm text-gray-500">Data do registro</dt>
          <dd className="font-semibold text-gray-900">
            {new Date(created_at).toLocaleDateString('pt-BR')}
          </dd>
        </div>
      </div>
    </dl>
  );
}
