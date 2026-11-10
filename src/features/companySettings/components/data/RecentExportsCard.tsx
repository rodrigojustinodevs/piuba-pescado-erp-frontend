'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { useToast } from '@/shared/contexts/ToastContext';
import { cn } from '@/shared/lib/utils';
import { EXPORT_TYPE_LABELS } from '../../constants/options';
import { companySettingsService } from '../../services/companySettingsService';
import type { RecentExport } from '../../types';
import { errorMessage, errorStatus } from '../../utils/errors';
import { SettingsCard } from '../SettingsCard';

const STATUS: Record<RecentExport['status'], { label: string; className: string }> = {
  pending: { label: 'Na fila', className: 'bg-muted text-muted-foreground' },
  processing: { label: 'Gerando', className: 'bg-sky-500/10 text-sky-700 dark:text-sky-300' },
  done: {
    label: 'Concluído',
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  },
  failed: { label: 'Falhou', className: 'bg-destructive/10 text-destructive' },
};

function DownloadButton({ id }: Readonly<{ id: string }>) {
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);

  /** URL assinada e temporária: busca uma nova a cada clique. */
  async function download() {
    setLoading(true);
    try {
      const fresh = await companySettingsService.getExport(id);
      if (fresh.downloadUrl) {
        window.open(fresh.downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        showError('O arquivo ainda não está disponível para download.');
      }
    } catch (error) {
      showError(
        errorStatus(error) === 403
          ? 'Você não tem permissão para baixar este tipo de exportação.'
          : errorMessage(error, 'Não foi possível baixar o arquivo.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={() => void download()} disabled={loading}>
      {loading ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        <Download aria-hidden="true" />
      )}
      Baixar
    </Button>
  );
}

export function RecentExportsCard({ exports }: Readonly<{ exports: RecentExport[] }>) {
  const { formatDateTime, formatNumber } = useCompanySettings();

  return (
    <SettingsCard
      title="Exportações recentes"
      description="As 10 últimas exportações da empresa, incluindo PDFs de relatórios."
    >
      {exports.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma exportação ainda.</p>
      ) : (
        <ul className="divide-y divide-border">
          {exports.map((item) => {
            const status = STATUS[item.status];
            return (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {EXPORT_TYPE_LABELS[item.type] ?? item.type}
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatDateTime(item.createdAt)}
                    {item.rows === null ? null : ` · ${formatNumber(item.rows)} linhas`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-medium',
                      status.className,
                    )}
                  >
                    {status.label}
                  </span>
                  {item.status === 'done' ? <DownloadButton id={item.id} /> : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SettingsCard>
  );
}
