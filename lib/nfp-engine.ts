export interface NfpRawRow {
  cpf: string;
  valorTotalNotas: number | string;
  creditos: number | string;
}

export interface NfpBaseCpfRecord {
  id: string;
  cpf: string;
  cpf_status: string;
  user_id: string;
  profiles?:
    | {
        id: string;
        full_name: string | null;
      }
    | {
        id: string;
        full_name: string | null;
      }[]
    | null;
}

export interface GroupedNfpRow {
  cpf: string; // apenas 11 dígitos
  totalNotas: number;
  totalCreditos: number;
  occurrences: number;
}

export interface NfpEligibleItem {
  cpf: string;
  cpfRecordId: string;
  userId: string;
  mobilizerName: string;
  totalNotas: number;
  totalCreditos: number;
  repasse20: number;
  occurrences: number;
}

export type NfpInvestigationReason =
  | 'NOT_FOUND'
  | 'PENDING'
  | 'REJECTED'
  | 'OTHER_STATUS';

export interface NfpInvestigationItem {
  cpf: string;
  reason: NfpInvestigationReason;
  reasonLabel: string;
  cpfStatus: string | null;
  userId: string | null;
  mobilizerName: string | null;
  totalNotas: number;
  totalCreditos: number;
  occurrences: number;
}

export interface NfpSummary {
  rawRowsCount: number;
  uniqueCpfsCount: number;
  eligibleCount: number;
  investigationCount: number;
  totalNotasElegiveis: number;
  totalCreditosElegiveis: number;
  totalRepasse20: number;
  totalCreditosInvestigacao: number;
}

export interface NfpProcessResult {
  summary: NfpSummary;
  eligibleItems: NfpEligibleItem[];
  investigationItems: NfpInvestigationItem[];
}

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizeCpfDigits(cpf: string): string {
  return (cpf || '').replace(/\D/g, '');
}

export function parseBrlCurrency(value: number | string): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? roundCurrency(value) : 0;
  }

  const cleaned = value.replace(/R\$/gi, '').replace(/\s+/g, '').trim();

  if (!cleaned) return 0;

  // Se houver vírgula, assume formato BR (1.234,56 -> remove pontos de milhar e troca vírgula por ponto)
  // Se não houver vírgula, assume número padrão ou inteiro
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? roundCurrency(parsed) : 0;
}

function extractMobilizer(record: NfpBaseCpfRecord) {
  const profile = Array.isArray(record.profiles)
    ? record.profiles[0]
    : record.profiles;

  return {
    userId: profile?.id || record.user_id,
    mobilizerName: profile?.full_name || 'Mobilizador sem nome',
  };
}

function mapInvestigationReason(status: string | null): {
  reason: NfpInvestigationReason;
  reasonLabel: string;
} {
  if (!status) {
    return { reason: 'NOT_FOUND', reasonLabel: 'CPF não encontrado na base' };
  }
  if (status === 'PENDING') {
    return { reason: 'PENDING', reasonLabel: 'CPF pendente de validação' };
  }
  if (status === 'REJECTED') {
    return { reason: 'REJECTED', reasonLabel: 'CPF invalidado/rejeitado' };
  }
  return { reason: 'OTHER_STATUS', reasonLabel: `Status: ${status}` };
}

export function groupNfpRowsByCpf(rows: NfpRawRow[]): GroupedNfpRow[] {
  const map = new Map<string, GroupedNfpRow>();

  for (const row of rows) {
    const cpfDigits = normalizeCpfDigits(row.cpf);
    if (!cpfDigits) continue;

    const notas = parseBrlCurrency(row.valorTotalNotas);
    const creditos = parseBrlCurrency(row.creditos);

    const existing = map.get(cpfDigits);
    if (existing) {
      existing.totalNotas = roundCurrency(existing.totalNotas + notas);
      existing.totalCreditos = roundCurrency(existing.totalCreditos + creditos);
      existing.occurrences += 1;
    } else {
      map.set(cpfDigits, {
        cpf: cpfDigits,
        totalNotas: notas,
        totalCreditos: creditos,
        occurrences: 1,
      });
    }
  }

  return Array.from(map.values());
}

export function processNfpCrossReference(
  rawRows: NfpRawRow[],
  baseCpfs: NfpBaseCpfRecord[],
): NfpProcessResult {
  const groupedRows = groupNfpRowsByCpf(rawRows);

  // Indexa CPFs da base por CPF normalizado
  // Prioriza APPROVED caso exista mais de um registro para o mesmo CPF
  const baseMap = new Map<string, NfpBaseCpfRecord>();
  for (const record of baseCpfs) {
    const cpfDigits = normalizeCpfDigits(record.cpf);
    if (!cpfDigits) continue;

    const current = baseMap.get(cpfDigits);
    if (
      !current ||
      (current.cpf_status !== 'APPROVED' && record.cpf_status === 'APPROVED')
    ) {
      baseMap.set(cpfDigits, record);
    }
  }

  const eligibleItems: NfpEligibleItem[] = [];
  const investigationItems: NfpInvestigationItem[] = [];

  for (const item of groupedRows) {
    const found = baseMap.get(item.cpf);

    if (found && found.cpf_status === 'APPROVED') {
      const { userId, mobilizerName } = extractMobilizer(found);
      const repasse20 = roundCurrency(item.totalCreditos * 0.2);

      eligibleItems.push({
        cpf: item.cpf,
        cpfRecordId: found.id,
        userId,
        mobilizerName,
        totalNotas: item.totalNotas,
        totalCreditos: item.totalCreditos,
        repasse20,
        occurrences: item.occurrences,
      });
    } else {
      const status = found?.cpf_status ?? null;
      const { reason, reasonLabel } = mapInvestigationReason(status);
      const mobilizerInfo = found ? extractMobilizer(found) : null;

      investigationItems.push({
        cpf: item.cpf,
        reason,
        reasonLabel,
        cpfStatus: status,
        userId: mobilizerInfo?.userId ?? null,
        mobilizerName: mobilizerInfo?.mobilizerName ?? null,
        totalNotas: item.totalNotas,
        totalCreditos: item.totalCreditos,
        occurrences: item.occurrences,
      });
    }
  }

  const totalNotasElegiveis = roundCurrency(
    eligibleItems.reduce((acc, cur) => acc + cur.totalNotas, 0),
  );
  const totalCreditosElegiveis = roundCurrency(
    eligibleItems.reduce((acc, cur) => acc + cur.totalCreditos, 0),
  );
  const totalRepasse20 = roundCurrency(
    eligibleItems.reduce((acc, cur) => acc + cur.repasse20, 0),
  );
  const totalCreditosInvestigacao = roundCurrency(
    investigationItems.reduce((acc, cur) => acc + cur.totalCreditos, 0),
  );

  return {
    summary: {
      rawRowsCount: rawRows.length,
      uniqueCpfsCount: groupedRows.length,
      eligibleCount: eligibleItems.length,
      investigationCount: investigationItems.length,
      totalNotasElegiveis,
      totalCreditosElegiveis,
      totalRepasse20,
      totalCreditosInvestigacao,
    },
    eligibleItems,
    investigationItems,
  };
}

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos ("créditos" -> "creditos")
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectCsvDelimiter(headerLine: string): ';' | ',' {
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return semicolons >= commas ? ';' : ',';
}

function parseCsvLine(line: string, delimiter: ';' | ','): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

export function parseNfpCsv(csvContent: string): NfpRawRow[] {
  const cleanContent = csvContent.replace(/^\uFEFF/, '');
  const lines = cleanContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) return [];

  const delimiter = detectCsvDelimiter(lines[0]);
  const headers = parseCsvLine(lines[0], delimiter).map(normalizeHeader);

  const cpfIndex = headers.findIndex((h) => h === 'cpf' || h.includes('cpf'));
  const notasIndex = headers.findIndex(
    (h) => h.includes('valor total') || h.includes('notas'),
  );
  const creditosIndex = headers.findIndex((h) => h.includes('credito'));

  if (cpfIndex === -1 || notasIndex === -1 || creditosIndex === -1) {
    throw new Error(
      'Cabeçalho do CSV inválido. Esperado: CPF, Valor Total das Notas e Créditos.',
    );
  }

  const rows: NfpRawRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i], delimiter);
    const cpf = cols[cpfIndex] ?? '';
    const valorTotalNotas = cols[notasIndex] ?? '0';
    const creditos = cols[creditosIndex] ?? '0';

    if (!normalizeCpfDigits(cpf)) continue;

    rows.push({
      cpf,
      valorTotalNotas,
      creditos,
    });
  }

  return rows;
}
