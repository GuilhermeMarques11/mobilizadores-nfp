import MobilizerList from '@/components/admin/mobilizer-list';
import { Loader } from 'lucide-react';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default function MobilizerListPage({ searchParams }: PageProps) {
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
      <Suspense fallback={<Loader className="animate-spin" />}>
        <MobilizerList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
