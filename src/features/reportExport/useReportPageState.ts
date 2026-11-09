'use client';

import { useCallback, useMemo, useState } from 'react';
import { HttpError } from '@/shared/lib/http/httpError';
import type { FieldErrors } from './fieldErrors';
import { toReportError, type ReportError } from './toReportError';

type Preview<TFilters> = {
  load: (filters: TFilters, options: { onError: (error: unknown) => void }) => void;
};

type Exporter<TInput> = {
  start: (input: TInput, options: { onError: (error: unknown) => void }) => void;
  isStarting: boolean;
  isActive: boolean;
  filtersKey: string | undefined;
};

type Options<TFilters, TInput> = {
  initialFilters: () => TFilters;
  validateFilters: (filters: TFilters) => FieldErrors<TFilters>;
  mapServerFieldErrors: (errors: Record<string, string[]> | undefined) => FieldErrors<TFilters>;
  preview: Preview<TFilters>;
  exporter: Exporter<TInput>;
  signature: (input: TInput) => string;
  /** Monta o corpo do export; padrão: filtros + `includeDetails`. */
  buildExportInput?: (filters: TFilters, includeDetails: boolean) => TInput;
};

/** Estado e ações comuns às páginas de relatório (filtros, validação, preview e export). */
export function useReportPageState<TFilters, TInput>({
  initialFilters,
  validateFilters,
  mapServerFieldErrors,
  preview,
  exporter,
  signature,
  buildExportInput = (filters, includeDetails) => ({ ...filters, includeDetails }) as TInput,
}: Options<TFilters, TInput>) {
  const [filters, setFilters] = useState<TFilters>(initialFilters);
  const [includeDetails, setIncludeDetails] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TFilters>>({});
  const [error, setError] = useState<ReportError | null>(null);

  const updateFilters = useCallback((patch: Partial<TFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  }, []);

  const handleFailure = useCallback(
    (failure: unknown) => {
      if (failure instanceof HttpError && failure.fieldErrors) {
        setFieldErrors(mapServerFieldErrors(failure.fieldErrors));
      }
      setError(toReportError(failure));
    },
    [mapServerFieldErrors],
  );

  const validate = useCallback((): boolean => {
    const errors = validateFilters(filters);
    setFieldErrors(errors);
    setError(null);
    return Object.keys(errors).length === 0;
  }, [filters, validateFilters]);

  const onPreview = useCallback(() => {
    if (!validate()) return;
    preview.load(filters, { onError: handleFailure });
  }, [validate, preview, filters, handleFailure]);

  const exportInput = useMemo(
    () => buildExportInput(filters, includeDetails),
    // buildExportInput é estável por feature (definido no módulo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, includeDetails],
  );

  const onExport = useCallback(() => {
    if (!validate()) return;
    exporter.start(exportInput, { onError: handleFailure });
  }, [validate, exporter, exportInput, handleFailure]);

  // Bloqueia duplicatas: há export em andamento com os mesmos filtros.
  const isExportBusy =
    exporter.isStarting || (exporter.isActive && exporter.filtersKey === signature(exportInput));

  return {
    filters,
    includeDetails,
    fieldErrors,
    error,
    isExportBusy,
    updateFilters,
    setIncludeDetails,
    onPreview,
    onExport,
  };
}
