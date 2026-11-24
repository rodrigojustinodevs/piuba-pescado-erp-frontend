import { extractHttpStatus, HttpError } from '@/shared/lib/http/httpError';

export const GATEWAY_UNAVAILABLE_MESSAGE = 'Tente novamente em instantes.';
export const FORBIDDEN_BILLING_MESSAGE =
  'Você não tem acesso à assinatura da empresa. Fale com o administrador.';

export function retryAfterSeconds(error: unknown): number | undefined {
  return error instanceof HttpError ? error.retryAfterSeconds : undefined;
}

/** Falha sem resposta útil: timeout (504) ou rede. A escrita pode ter acontecido. */
export function isUncertainFailure(error: unknown): boolean {
  const status = extractHttpStatus(error);
  if (status === 504) return true;
  return status === null && error instanceof TypeError;
}

/** Mensagem para o usuário, sem detalhe técnico em 5xx. */
export function billingErrorMessage(error: unknown): string {
  const status = extractHttpStatus(error);
  const message = error instanceof Error ? error.message : '';
  switch (status) {
    case 403:
      return FORBIDDEN_BILLING_MESSAGE;
    case 404:
      return 'Não há assinatura ativa para esta empresa.';
    case 429: {
      const seconds = retryAfterSeconds(error);
      return seconds
        ? `Muitas tentativas. Tente de novo em ${seconds} s.`
        : 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    }
    case 500:
    case 502:
    case 503:
    case 504:
      return GATEWAY_UNAVAILABLE_MESSAGE;
    default:
      return message || 'Não foi possível concluir a operação.';
  }
}
