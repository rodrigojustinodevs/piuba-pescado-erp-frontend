import { HttpError } from '@/shared/lib/http/httpError';

export type ReportError = { message: string; status: number | null };

export function toReportError(error: unknown): ReportError {
  if (error instanceof HttpError) {
    let message = error.message;
    if (error.status === 403) message = 'Você não tem permissão para acessar este relatório.';
    if (error.message.includes('master_admin')) {
      message = `${error.message} Selecione uma empresa ativa e tente novamente.`;
    }
    return { message, status: error.status };
  }
  return {
    message: error instanceof Error ? error.message : 'Erro inesperado.',
    status: null,
  };
}
