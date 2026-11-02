export { cn } from 'cn';

/******************
 Máscara para o campo de CPF
 ******************/
export const maskCpf = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

/******************
 Máscara para o campo de telefone
 ******************/
export const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

/******************
 Remove a máscara do campo
 ******************/
export const unMask = (value: string) => {
  return value.replace(/\D/g, '');
};

/******************
 Pega as iniciais do nome
 ******************/
export function getInitials(fullName?: string | null): string {
  if (!fullName) return '';

  return fullName
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
}

/******************
 Altera cor e label de acordo com status (Para CPF e Usuário)
 ******************/
export const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  ACTIVE: 'bg-green-500 text-white',
  REJECTED: 'bg-red-100 text-red-800',
};

export const statusName: Record<string, string> = {
  PENDING: 'Pendente',
  APPROVED: 'Aprovado',
  ACTIVE: 'Ativo',
  REJECTED: 'Rejeitado',
};
