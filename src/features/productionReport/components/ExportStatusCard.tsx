'use client';

import { AlertTriangle, CheckCircle2, Clock, Download, Loader2, RotateCcw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/Collapsible';
import { formatDateTimeLocal } from '@/shared/utils/dateFormat';
import type { ExportStatus } from '../types';
import { fmtDuration, fmtNumber } from '../utils/format';

type Props = Readonly<{
  status: ExportStatus | undefined;
  timedOut: boolean;
  pollingError: boolean;
  isStarting: boolean;
  onDownload: () => void;
  onRetry: () => void;
  onDismiss: () => void;
}>;

export function ExportStatusCard({
  status,
  timedOut,
  pollingError,
  isStarting,
  onDownload,
  onRetry,
  onDismiss,
}: Props) {
  const current = status?.status;

  let icon = <Clock className="h-5 w-5 text-slate-500" aria-hidden="true" />;
  let title = 'Na fila…';
  let description = 'O PDF foi enfileirado. Você pode continuar usando o sistema.';

  if (current === 'processing') {
    icon = <Loader2 className="h-5 w-5 animate-spin text-[#0EA5A4]" aria-hidden="true" />;
    title = 'Gerando PDF…';
    description = 'Pode levar de segundos a vários minutos, principalmente com o anexo analítico.';
  } else if (current === 'done') {
    icon = <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />;
    title = 'PDF pronto';
    description = `${fmtNumber(status?.rows)} linhas · gerado em ${fmtDuration(status?.durationMs)}`;
  } else if (current === 'failed') {
    icon = <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />;
    title = 'Não foi possível gerar o PDF';
    description = 'Tente novamente. Se o problema persistir, contate o suporte.';
  } else if (!status) {
    title = 'Consultando status…';
  }

  if (timedOut && current !== 'done' && current !== 'failed') {
    icon = <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />;
    title = 'A geração está demorando mais que o esperado';
    description =
      'Paramos de acompanhar. Volte a esta tela mais tarde: retomamos o acompanhamento.';
  }

  return (
    <section
      aria-live="polite"
      aria-label="Status da geração do PDF"
      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-[#0F172A]">{title}</p>
          <p className="text-sm text-slate-600">{description}</p>
          {status?.createdAt && (
            <p className="mt-1 text-xs text-slate-500">
              Solicitado em {formatDateTimeLocal(status.createdAt)}
            </p>
          )}
          {pollingError && (
            <p className="mt-1 text-xs text-amber-700">
              Falha ao consultar o status. Tentando novamente…
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          aria-label="Dispensar status do PDF"
        >
          <X aria-hidden="true" />
        </Button>
      </div>

      {current === 'failed' && status?.error && (
        <Collapsible className="mt-3">
          <CollapsibleTrigger className="text-xs font-medium text-[#0F766E] underline-offset-2 hover:underline">
            Detalhes técnicos
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-xs text-slate-700">
              {status.error}
            </pre>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {current === 'done' && (
          <Button onClick={onDownload} className="bg-[#0EA5A4] hover:bg-[#0F766E]">
            <Download aria-hidden="true" />
            Baixar PDF
          </Button>
        )}
        {(current === 'failed' || timedOut) && (
          <Button variant="outline" onClick={onRetry} disabled={isStarting}>
            <RotateCcw aria-hidden="true" />
            Tentar novamente
          </Button>
        )}
      </div>
    </section>
  );
}
