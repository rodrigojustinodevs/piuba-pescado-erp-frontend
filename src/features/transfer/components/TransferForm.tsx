'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import {
  createTransferSchema,
  updateTransferSchema,
  type CreateTransferFormData,
  type UpdateTransferFormData,
} from '../schemas';
import type { PatchTransferPayload, Transfer, TransferStatus } from '../types';
import { REASON_LABELS, STATUS_LABELS } from '../types';
import type { Batch } from '@/features/batch/types';
import type { Tank } from '@/features/tank/types';
import { batchService } from '@/features/batch/services/batchService';
import { tankService } from '@/features/tank/services/tankService';
import { useBatches } from '@/features/batch';
import { formatBatchOptionLabel } from '@/features/batch/utils/format';
import { useTanksWithoutBatches } from '@/features/tank';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { useToast } from '@/shared/contexts/ToastContext';
import { useAlertModal } from '@/shared/components/AlertModal/AlertModalContext';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { FormActions, TextArea, Select, ControlledSelect } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';

export type ApiFieldError = {
  field: string;
  message: string;
} | null;

type TransferFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  apiError?: ApiFieldError;
};

export type TransferFormProps =
  | (TransferFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateTransferFormData) => void;
    })
  | (TransferFormCommonProps & {
      mode: 'update';
      initialData: Transfer;
      onSubmit: (data: PatchTransferPayload) => void;
    });

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

function getStatusTransitionMessage(
  from: TransferStatus | undefined,
  to: TransferStatus,
  transfer: Transfer | undefined,
): string | null {
  const qty = transfer?.quantity?.toLocaleString('pt-BR') ?? '?';
  const origin = transfer?.originTankName ?? 'Tanque de origem';
  const dest = transfer?.destinationTankName ?? 'Tanque de destino';

  if (from === 'scheduled' && to === 'completed') {
    return `Confirmar execução? ${qty} organismos serão movidos de ${origin} para ${dest} agora.`;
  }
  if (from === 'completed' && to === 'cancelled') {
    return `⚠ Cancelar uma transferência concluída reverterá a movimentação. ${qty} organismos voltarão ao ${origin}.`;
  }
  if (from === 'completed' && to === 'scheduled') {
    return '⚠ Reabrir esta transferência reverterá a movimentação realizada.';
  }
  if (from === 'cancelled' && to === 'completed') {
    return `Confirmar execução? ${qty} organismos serão movidos agora.`;
  }
  return null;
}

export function TransferForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Registrar',
  onCancel,
  apiError,
}: TransferFormProps) {
  const { isMaster } = useAuthContext();
  const { showError } = useToast();
  const { showWarning } = useAlertModal();
  const isEditMode = mode === 'update';
  const showCompanyField = isMaster() && !isEditMode;

  const { companyOptions, loadingCompanies } = useCompanyOptions(showCompanyField);

  const [companyBatches, setCompanyBatches] = useState<Batch[]>([]);
  const [companyTanks, setCompanyTanks] = useState<Tank[]>([]);
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
    enabled: !showCompanyField,
  });
  const defaultBatches = useMemo(() => batchesData?.batches ?? [], [batchesData]);

  const { data: destinationTanksData, isLoading: isLoadingDestinationTanks } =
    useTanksWithoutBatches({ page: 1, perPage: 1000, enabled: !showCompanyField });
  const defaultTanks = useMemo(() => destinationTanksData?.tanks ?? [], [destinationTanksData]);

  const batches = showCompanyField ? companyBatches : defaultBatches;
  const destinationTankList = showCompanyField ? companyTanks : defaultTanks;
  const isLoadingBatchesEffective = showCompanyField ? isLoadingCompanyData : isLoadingBatches;
  const isLoadingTanksEffective = showCompanyField
    ? isLoadingCompanyData
    : isLoadingDestinationTanks;

  const baseSchema = isEditMode ? updateTransferSchema : createTransferSchema;
  const resolverSchema = useMemo(
    () =>
      baseSchema.superRefine((data, ctx) => {
        if (showCompanyField && !data.companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [baseSchema, showCompanyField],
  );

  const emptyValues: CreateTransferFormData = {
    companyId: '',
    batchId: '',
    originTankId: '',
    destinationTankId: '',
    quantity: 0,
    description: '',
    transferDate: todayIso(),
    averageWeight: undefined,
    reason: 'growth',
    status: 'completed',
    responsible: '',
  };

  const buildValuesFromInitial = (data: Transfer): UpdateTransferFormData => ({
    id: data.id,
    companyId: '',
    batchId: data.batchId,
    originTankId: data.originTankId,
    destinationTankId: data.destinationTankId,
    quantity: data.quantity,
    description: data.description,
    transferDate: data.transferDate ?? todayIso(),
    averageWeight: data.averageWeight,
    reason: (data.reason ?? 'growth') as CreateTransferFormData['reason'],
    status: data.status as CreateTransferFormData['status'],
    responsible: data.responsible ?? '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    reset,
    setValue,
    setError,
    watch,
  } = useForm<CreateTransferFormData | UpdateTransferFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData ? buildValuesFromInitial(initialData) : emptyValues,
  });

  useEffect(() => {
    if (initialData) reset(buildValuesFromInitial(initialData));
  }, [initialData, reset]);

  // Apply API errors to form fields
  useEffect(() => {
    if (!apiError) return;
    const field = apiError.field as keyof (CreateTransferFormData | UpdateTransferFormData);
    if (field === ('root' as unknown)) {
      setError('root' as keyof (CreateTransferFormData | UpdateTransferFormData), {
        message: apiError.message,
      });
    } else {
      setError(field, { message: apiError.message });
    }
  }, [apiError, setError]);

  const companyId = watch('companyId');
  const originTankId = watch('originTankId');
  const destinationTankId = watch('destinationTankId');
  const batchId = watch('batchId');
  const currentStatus = watch('status') as TransferStatus | undefined;

  const quantity = useWatch({ control, name: 'quantity' }) ?? 0;
  const averageWeight = useWatch({ control, name: 'averageWeight' }) ?? 0;
  const biomass = (Number(quantity) * Number(averageWeight)) / 1000;

  const isCompleted = isEditMode && currentStatus === 'completed';


  const loadCompanyData = useCallback(
    async (selectedCompanyId: string) => {
      setIsLoadingCompanyData(true);
      setCompanyDataLoaded(false);
      setCompanyBatches([]);
      setCompanyTanks([]);

      try {
        const [batchesResult, tanksResult] = await Promise.all([
          batchService.getBatches({ page: 1, limit: 1000, companyId: selectedCompanyId }),
          tankService.listWithoutBatches({ page: 1, perPage: 1000, companyId: selectedCompanyId }),
        ]);

        setCompanyBatches(batchesResult.batches);
        setCompanyTanks(tanksResult.tanks);
        setCompanyDataLoaded(true);
      } catch {
        showError('Erro ao carregar dados da empresa. Verifique sua conexão e tente novamente.');
      } finally {
        setIsLoadingCompanyData(false);
      }
    },
    [showError],
  );

  useEffect(() => {
    if (!showCompanyField || !companyId) {
      setCompanyBatches([]);
      setCompanyTanks([]);
      setCompanyDataLoaded(false);
      return;
    }

    setValue('batchId', '', { shouldDirty: true, shouldValidate: false });
    setValue('originTankId', '', { shouldDirty: true, shouldValidate: false });
    setValue('destinationTankId', '', { shouldDirty: true, shouldValidate: false });

    loadCompanyData(companyId);
  }, [companyId, showCompanyField, loadCompanyData, setValue]);

  const selectedBatch = useMemo(() => batches.find((b) => b.id === batchId), [batches, batchId]);
  const originTankLabel = selectedBatch?.tank?.name ?? '—';

  const destinationTanksWithCurrent = useMemo(() => {
    if (!isEditMode || !destinationTankId) return destinationTankList;
    const exists = destinationTankList.some((t) => t.id === destinationTankId);
    if (exists) return destinationTankList;
    return [
      ...destinationTankList,
      {
        id: destinationTankId,
        name: `Tanque ${destinationTankId.slice(0, 8)}…`,
      } as unknown as Tank,
    ];
  }, [destinationTankList, destinationTankId, isEditMode]);

  const destinationTankOptions = useMemo(() => {
    if (!originTankId) return destinationTanksWithCurrent;
    return destinationTanksWithCurrent.filter((t) => t.id !== originTankId);
  }, [destinationTanksWithCurrent, originTankId]);

  const batchDisabled =
    isCompleted ||
    isLoading ||
    isLoadingBatchesEffective ||
    (showCompanyField && !companyDataLoaded);
  const tankDisabled =
    isCompleted || isLoading || isLoadingTanksEffective || (showCompanyField && !companyDataLoaded);
  const quantityDisabled = isCompleted || isLoading;

  const reasonOptions = useMemo(
    () => Object.entries(REASON_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );
  const statusOptions = useMemo(
    () => Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  function buildAndSubmit(data: CreateTransferFormData | UpdateTransferFormData) {
    if (mode === 'update') {
      const patch: PatchTransferPayload = {
        id: (data as UpdateTransferFormData).id,
        reason: (data as UpdateTransferFormData).reason,
      };
      for (const key of Object.keys(dirtyFields) as Array<keyof typeof dirtyFields>) {
        (patch as unknown as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key];
      }
      if (
        patch.quantity !== undefined &&
        selectedBatch &&
        patch.quantity > selectedBatch.initialQuantity
      ) {
        setError('quantity', {
          message: `Quantidade informada excede o estoque disponível (${selectedBatch.initialQuantity.toLocaleString('pt-BR')} disponíveis).`,
        });
        return;
      }

      if (patch.status) {
        const msg = getStatusTransitionMessage(
          initialData?.status as TransferStatus | undefined,
          patch.status as TransferStatus,
          initialData,
        );
        if (msg) {
          showWarning('Confirmar ação', msg, 'Confirmar', () =>
            (onSubmit as (data: PatchTransferPayload) => void)(patch),
          );
          return;
        }
      }

      (onSubmit as (data: PatchTransferPayload) => void)(patch);
    } else {
      const qty = (data as CreateTransferFormData).quantity;
      if (selectedBatch && qty > selectedBatch.initialQuantity) {
        setError('quantity', {
          message: `Quantidade informada excede o estoque disponível (${selectedBatch.initialQuantity.toLocaleString('pt-BR')} disponíveis).`,
        });
        return;
      }
      (onSubmit as (data: CreateTransferFormData) => void)(data as CreateTransferFormData);
    }
  }

  // Root-level API error banner
  const rootError = (errors as Record<string, { message?: string }>)['root']?.message;

  return (
    <form onSubmit={handleSubmit(buildAndSubmit)} className="space-y-5">
      {rootError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {rootError}
        </div>
      )}

      {/* Empresa — apenas admin, apenas no create */}
      {showCompanyField && (
        <Select
          label="Empresa"
          required
          disabled={isLoading || loadingCompanies}
          options={companyOptions}
          placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
          {...register('companyId')}
          error={errors.companyId?.message}
        />
      )}

      {/* Lote */}
      <Controller
        name="batchId"
        control={control}
        render={({ field }) => (
          <Select
            label="Lote"
            required
            disabled={batchDisabled}
            placeholder={isLoadingBatchesEffective ? 'Carregando lotes...' : 'Selecione o lote'}
            options={batches.map((b) => ({
              value: b.id,
              label: formatBatchOptionLabel(b),
            }))}
            value={field.value || ''}
            onChange={(e) => {
              const nextId = e.target.value;
              field.onChange(nextId);

              const batch = batches.find((b) => b.id === nextId);
              const nextOriginTankId = batch?.tank?.id;

              setValue('originTankId', nextOriginTankId ?? '', {
                shouldDirty: true,
                shouldValidate: true,
              });

              if (!isEditMode) {
                setValue('quantity', batch?.initialQuantity ?? 0, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }

              if (!nextOriginTankId || destinationTankId === nextOriginTankId) {
                setValue('destinationTankId', '', {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }
            }}
            error={errors.batchId?.message}
          />
        )}
      />

      {/* Tanque Origem → Tanque Destino */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
        <Input
          label="Tanque de Origem"
          requiredIndicator
          type="text"
          value={originTankLabel}
          disabled
          readOnly
          error={errors.originTankId?.message}
        />

        <div className="flex items-center justify-center pb-2 text-slate-400">
          <ArrowRight className="h-5 w-5" />
        </div>

        <Controller
          name="destinationTankId"
          control={control}
          render={({ field }) => (
            <Select
              label="Tanque de Destino"
              required
              disabled={tankDisabled}
              placeholder={isLoadingTanksEffective ? 'Carregando tanques...' : 'Destino'}
              options={destinationTankOptions.map((tank) => ({
                value: tank.id,
                label: tank.name,
              }))}
              value={field.value || ''}
              onChange={(e) => field.onChange(e.target.value)}
              error={errors.destinationTankId?.message}
            />
          )}
        />
      </div>

      {/* Reabrir quando completed */}
      {isCompleted && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span className="flex-1">
            Campos de origem, destino, lote e quantidade estão bloqueados porque esta transferência
            foi concluída.
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              showWarning(
                'Reabrir transferência',
                '⚠ Reabrir esta transferência reverterá a movimentação realizada. Deseja continuar?',
                'Reabrir',
                () => setValue('status', 'scheduled', { shouldDirty: true }),
              )
            }
          >
            Reabrir
          </Button>
        </div>
      )}

      {/* Data | Quantidade | Peso médio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Data"
          type="date"
          disabled={isLoading}
          {...register('transferDate')}
          error={errors.transferDate?.message}
        />

        <div className="flex flex-col gap-1">
          <Input
            label="Quantidade"
            requiredIndicator
            type="number"
            step={1}
            min={1}
            disabled={quantityDisabled}
            {...register('quantity', { valueAsNumber: true })}
            error={errors.quantity?.message}
          />
          {selectedBatch && (
            <p className="text-xs text-slate-500">
              Estoque disponível:{' '}
              <span className="font-medium">
                {selectedBatch.initialQuantity.toLocaleString('pt-BR')}
              </span>
            </p>
          )}
        </div>

        <Input
          label="Peso médio (g)"
          type="number"
          step={0.01}
          min={0}
          disabled={isLoading}
          {...register('averageWeight', { valueAsNumber: true })}
          error={errors.averageWeight?.message}
        />
      </div>

      {/* Biomassa calculada */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Biomassa transferida:{' '}
        <span className="font-semibold">
          {biomass.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          kg
        </span>
      </div>

      {/* Motivo | Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ControlledSelect
          control={control}
          name="reason"
          label="Motivo"
          placeholder="Selecione o motivo"
          options={reasonOptions}
          error={errors.reason?.message}
        />
        <ControlledSelect
          control={control}
          name="status"
          label="Status"
          placeholder="Selecione o status"
          options={statusOptions}
          error={errors.status?.message}
        />
      </div>

      {/* Responsável */}
      <Input
        label="Responsável"
        type="text"
        placeholder="Nome do responsável pela operação"
        disabled={isLoading}
        {...register('responsible')}
        error={errors.responsible?.message}
      />

      {/* Observações */}
      <TextArea
        label="Observações"
        required
        placeholder="Detalhes da transferência..."
        rows={3}
        disabled={isLoading}
        {...register('description')}
        error={errors.description?.message}
      />

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={isEditMode ? 'Atualizando...' : 'Registrando...'}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
}
