'use client';

import { useState, useTransition } from 'react';
import {
  parseNfpCsv,
  processNfpCrossReference,
  type NfpBaseCpfRecord,
  type NfpProcessResult,
} from '@/lib/nfp-engine';

import { NfpUploadCard } from './nfp-upload-card';
import { NfpSummaryCard } from './nfp-summary-card';
import { NfpEligibleTable } from './nfp-eligible-table';
import { NfpInvestigationTable } from './nfp-investigation-table';

interface NfpClientProps {
  baseRecords: NfpBaseCpfRecord[];
}

export function NfpClient({ baseRecords }: NfpClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [result, setResult] = useState<NfpProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canProcess = !!file && !isPending;

  const handleProcess = () => {
    if (!file) return;

    setError(null);
    setResult(null);

    startTransition(async () => {
      try {
        const text = await file.text();

        // parseNfpCsv lança erro se o cabeçalho for inválido.
        const rawRows = parseNfpCsv(text);

        if (rawRows.length === 0) {
          setError(
            'Nenhuma linha válida encontrada no arquivo. Verifique se o CSV ' +
              'contém CPF, Valor Total das Notas e Créditos.',
          );
          return;
        }

        const processed = processNfpCrossReference(rawRows, baseRecords);
        setResult(processed);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : 'Erro inesperado ao processar o arquivo.',
        );
      }
    });
  };

  return (
    <div className="space-y-6">
      <NfpUploadCard
        file={file}
        onFileChange={(f) => {
          setFile(f);
          setResult(null);
          setError(null);
        }}
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onProcess={handleProcess}
        canProcess={canProcess}
        isPending={isPending}
        error={error}
      />

      {result && (
        <>
          <NfpSummaryCard month={month} year={year} summary={result.summary} />

          {result.eligibleItems.length > 0 ? (
            <NfpEligibleTable items={result.eligibleItems} />
          ) : (
            <EmptyState
              title="Nenhum repasse elegível"
              description="Nenhum CPF do arquivo está aprovado na base."
            />
          )}

          {result.investigationItems.length > 0 ? (
            <NfpInvestigationTable items={result.investigationItems} />
          ) : (
            <EmptyState
              title="Nenhum CPF em investigação"
              description="Todos os CPFs do arquivo foram classificados como elegíveis."
            />
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-lg border border-dashed bg-card p-6 text-center">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </section>
  );
}
