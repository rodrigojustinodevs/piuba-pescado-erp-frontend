'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/shared/contexts/ToastContext';
import { EXPORT_POLL_MAX_MS, EXPORT_POLL_MIN_MS, EXPORT_POLL_TIMEOUT_MS } from '../constants';
import { productionReportService } from '../services/productionReportService';
import type { ExportStatus, StartExportInput } from '../types';
import { usePersistedExport } from './usePersistedExport';

const TERMINAL: ExportStatus['status'][] = ['done', 'failed'];

function nextInterval(updateCount: number): number {
  return Math.min(EXPORT_POLL_MIN_MS + updateCount * 500, EXPORT_POLL_MAX_MS);
}

export function filtersSignature(input: StartExportInput): string {
  return JSON.stringify({
    ...input,
    batchIds: [...input.batchIds].sort(),
    tankIds: [...input.tankIds].sort(),
  });
}

export function useProductionExport() {
  const { showError } = useToast();
  const { current, save, clear } = usePersistedExport();
  const [timedOutFor, setTimedOutFor] = useState<number | null>(null);

  const exportId = current?.exportId;
  const startedAt = current?.startedAt;
  const timedOut = startedAt !== undefined && timedOutFor === startedAt;

  const statusQuery = useQuery({
    queryKey: ['production-report', 'export', exportId],
    queryFn: () => productionReportService.getExport(exportId as string),
    enabled: Boolean(exportId) && !timedOut,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL.includes(status)) return false;
      if (startedAt && Date.now() - startedAt > EXPORT_POLL_TIMEOUT_MS) return false;
      return nextInterval(query.state.dataUpdateCount);
    },
  });

  const status = statusQuery.data?.status;

  // Teto de espera no cliente: depois disso, orienta a consultar mais tarde.
  useEffect(() => {
    if (!startedAt || (status && TERMINAL.includes(status))) return;
    const remaining = Math.max(startedAt + EXPORT_POLL_TIMEOUT_MS - Date.now(), 0);
    const timer = setTimeout(() => setTimedOutFor(startedAt), remaining);
    return () => clearTimeout(timer);
  }, [startedAt, status]);

  // Export removido/de outra empresa (404): esquece o id persistido.
  const queryErrorStatus = (statusQuery.error as { status?: number } | null)?.status;
  useEffect(() => {
    if (queryErrorStatus === 404) clear();
  }, [queryErrorStatus, clear]);

  const startMutation = useMutation({
    mutationFn: (input: StartExportInput) => productionReportService.startExport(input),
    onSuccess: (result, input) => {
      save({
        exportId: result.exportId,
        filtersKey: filtersSignature(input),
        startedAt: Date.now(),
      });
    },
  });

  const isActive = Boolean(exportId) && !timedOut && !(status && TERMINAL.includes(status));

  /** Gera nova URL assinada a cada clique e abre o PDF. */
  const download = useCallback(async () => {
    if (!exportId) return;
    try {
      const fresh = await productionReportService.getExport(exportId);
      if (fresh.downloadUrl) {
        window.open(fresh.downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        showError('O arquivo ainda não está disponível para download.');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Não foi possível baixar o PDF.');
    }
  }, [exportId, showError]);

  return {
    exportId,
    filtersKey: current?.filtersKey,
    exportStatus: statusQuery.data,
    isPollingError: statusQuery.isError && queryErrorStatus !== 404,
    isActive,
    timedOut,
    start: startMutation.mutate,
    isStarting: startMutation.isPending,
    startError: startMutation.error,
    download,
    dismiss: clear,
  };
}
