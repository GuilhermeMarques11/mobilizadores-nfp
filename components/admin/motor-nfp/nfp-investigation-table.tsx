'use client';

import type { NfpInvestigationItem } from '@/lib/nfp-engine';

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function NfpInvestigationTable({
  items,
}: {
  items: NfpInvestigationItem[];
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">
        CPFs para investigação ({items.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left">CPF</th>
              <th className="px-3 py-2 text-left">Motivo</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Mobilizador</th>
              <th className="px-3 py-2 text-right">Créditos</th>
              <th className="px-3 py-2 text-right">Ocorr.</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.cpf} className="border-b last:border-0">
                <td className="px-3 py-2 font-mono">{it.cpf}</td>
                <td className="px-3 py-2">{it.reasonLabel}</td>
                <td className="px-3 py-2">
                  {it.cpfStatus ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {it.mobilizerName ?? (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {brl(it.totalCreditos)}
                </td>
                <td className="px-3 py-2 text-right">{it.occurrences}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
