import { isValidCnpj, onlyDigits } from '@/features/companySettings/utils/document';

export { onlyDigits };

/** CPF: 11 dígitos, não repetidos, dígitos verificadores válidos. */
export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(d[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

/** Documento opcional da contratação: vazio é válido (vale o CNPJ da empresa). */
export function validateDocument(value: string): string | null {
  const d = onlyDigits(value);
  if (!d) return null;
  if (d.length === 11) return isValidCpf(d) ? null : 'CPF inválido.';
  if (d.length === 14) return isValidCnpj(d) ? null : 'CNPJ inválido.';
  return 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).';
}
