'use client';

import type { NfpSummary } from '@/lib/nfp-engine';

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Props {
  month: number;
  year: number;
  summary: NfpSummary;
}

export function NfpSummaryCard({ month, year, summary }: Props) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resumo do lote</h2>
        <span className="text-sm text-muted-foreground">
          Referência: {String(month).padStart(2, '0')}/{year}
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Linhas no CSV" value={String(summary.rawRowsCount)} />
        <Stat label="CPFs únicos" value={String(summary.uniqueCpfsCount)} />
        <Stat label="Elegíveis" value={String(summary.eligibleCount)} />
        <Stat label="Investigação" value={String(summary.investigationCount)} />
      </dl>

      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Notas (elegíveis)"
          value={brl(summary.totalNotasElegiveis)}
        />
        <Stat
          label="Créditos (elegíveis)"
          value={brl(summary.totalCreditosElegiveis)}
        />
        <Stat
          label="Repasse 20%"
          value={brl(summary.totalRepasse20)}
          highlight
        />
        <Stat
          label="Créditos (investigação)"
          value={brl(summary.totalCreditosInvestigacao)}
        />
      </dl>
    </section>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-md border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={
          highlight
            ? 'text-lg font-bold text-emerald-700'
            : 'text-lg font-semibold'
        }
      >
        {value}
      </dd>
    </div>
  );
}
