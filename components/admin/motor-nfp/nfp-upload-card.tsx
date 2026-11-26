'use client';

import { useRef } from 'react';
import { Loader2, Upload } from 'lucide-react'; // ajuste se não usar lucide

interface NfpUploadCardProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
  onProcess: () => void;
  canProcess: boolean;
  isPending: boolean;
  error: string | null;
}

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function NfpUploadCard({
  file,
  onFileChange,
  month,
  year,
  onMonthChange,
  onYearChange,
  onProcess,
  canProcess,
  isPending,
  error,
}: NfpUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="space-y-4 rounded-lg border bg-card p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium">Mês de referência</span>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={month}
            onChange={(e) => onMonthChange(Number(e.target.value))}
          >
            {MONTHS.map((name, idx) => (
              <option key={idx} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium">Ano de referência</span>
          <input
            type="number"
            min={2020}
            max={2100}
            className="w-full rounded-md border bg-background px-3 py-2"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Arquivo .csv</span>
        <div
          className="flex items-center gap-3 rounded-md border border-dashed p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onFileChange(f);
          }}
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1 text-sm">
            {file ? (
              <span className="font-medium">{file.name}</span>
            ) : (
              <span className="text-muted-foreground">
                Arraste o arquivo aqui ou clique em &quot;Selecionar&quot;.
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
            onClick={() => inputRef.current?.click()}
          >
            Selecionar
          </button>
          {file && (
            <button
              type="button"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
              onClick={() => onFileChange(null)}
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          disabled={!canProcess}
          onClick={onProcess}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Processando…' : 'Processar arquivo'}
        </button>
      </div>
    </section>
  );
}
