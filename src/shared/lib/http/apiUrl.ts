const DEV_FALLBACK = 'http://localhost:8005';

/**
 * URL base da API Laravel. Usada apenas no servidor (route handlers/BFF),
 * por isso a variável preferida é `API_URL` (não exposta ao browser).
 * `NEXT_PUBLIC_API_URL` é aceita como legado.
 * Em produção a ausência da variável é um erro: nunca cair em localhost.
 */
export function getApiBaseUrl(): string {
  const url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (url) return url.replace(/\/+$/, '');

  if (process.env.NODE_ENV === 'production') {
    throw new Error('API_URL não configurada. Defina API_URL com a URL da API Laravel.');
  }
  return DEV_FALLBACK;
}
