'use client';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ListEmptyState, ListLoadingState } from '@/shared/components/states/ListStates';
import { Alert, AlertDescription } from '@/shared/components/ui/Alert';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { ExportStatusCard } from './ExportStatusCard';
import type { ExportStatus } from './types';

type Props = Readonly<{
  title: string;
  icon: LucideIcon;
  allowedRoles: string[];
  /** Formulário de filtros. */
  filters: ReactNode;
  error: { message: string } | null;
  isPreviewLoading: boolean;
  onExport: () => void;
  exporter: {
    exportId: string | undefined | null;
    exportStatus: ExportStatus | undefined;
    timedOut: boolean;
    isPollingError: boolean;
    isStarting: boolean;
    download: () => void;
    dismiss: () => void;
  };
  /** Resultado do preview; renderizado só fora do loading. */
  children?: ReactNode;
}>;

/** Casca comum das telas de relatório: permissão, cabeçalho, erro, status do PDF e loading. */
export function ReportViewShell({
  title,
  icon: Icon,
  allowedRoles,
  filters,
  error,
  isPreviewLoading,
  onExport,
  exporter,
  children,
}: Props) {
  const { user, isLoading, canAccess } = useAuthContext();

  if (isLoading || !user) return <ListLoadingState label="Carregando sessão…" />;

  if (!canAccess(allowedRoles)) {
    return (
      <ListEmptyState
        title="Você não tem permissão para acessar este relatório."
        subtitle="Fale com um administrador da empresa."
      />
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-3">
        <span className="rounded-lg bg-[#0EA5A4]/10 p-2 text-[#0F766E]">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
          <p className="text-sm text-slate-600">
            Visualize na tela ou gere o PDF com os mesmos filtros.
          </p>
        </div>
      </header>

      {filters}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {exporter.exportId && (
        <ExportStatusCard
          status={exporter.exportStatus}
          timedOut={exporter.timedOut}
          pollingError={exporter.isPollingError}
          isStarting={exporter.isStarting}
          onDownload={exporter.download}
          onRetry={onExport}
          onDismiss={exporter.dismiss}
        />
      )}

      {isPreviewLoading ? <ListLoadingState label="Carregando relatório…" /> : children}
    </div>
  );
}
