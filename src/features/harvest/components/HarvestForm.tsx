'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  createHarvestSchema,
  updateHarvestSchema,
  type CreateHarvestFormData,
  type UpdateHarvestFormData,
} from '../schemas';
import type { Harvest, HarvestStatus, PatchHarvestPayload } from '../types';
import {
  HARVEST_DESTINATION_LABELS,
  HARVEST_STATUS_LABELS,
  HARVEST_TYPE_LABELS,
} from '../types';
import type { Batch } from '@/features/batch/types';
import type { Tank } from '@/features/tank/types';
import { batchService } from '@/features/batch/services/batchService';
import { tankService } from '@/features/tank/services/tankService';
import { useBatches } from '@/features/batch';
import { formatBatchOptionLabel } from '@/features/batch/utils/format';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { useToast } from '@/shared/contexts/ToastContext';
import { addRequiredCompanyIssue } from '@/shared/utils/zod';
import { FormActions, Select, TextArea, ControlledSelect } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/Button';

export type ApiFieldError = { field: string; message: string } | null;

type CommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  apiError?: ApiFieldError;
};

export type HarvestFormProps =
  | (CommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateHarvestFormData) => void;
    })
  | (CommonProps & {
      mode: 'update';
      initialData: Harvest;
      onSubmit: (data: PatchHarvestPayload) => void;
    });

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

const fmt = (n: number, opts?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat('pt-BR', opts).format(n);

const fmtCurrency = (n: number) => fmt(n, { style: 'currency', currency: 'BRL' });
const fmtPct = (n: number) =>
  fmt(n, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';

export function HarvestForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Registrar',
  onCancel,
  apiError,
}: HarvestFormProps) {
  const { isMaster } = useAuthContext();
  const { showError } = useToast();
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
  const batches = showCompanyField ? companyBatches : defaultBatches;
  const isLoadingBatchesEffective = showCompanyField ? isLoadingCompanyData : isLoadingBatches;

  const baseSchema = isEditMode ? updateHarvestSchema : createHarvestSchema;
  const resolverSchema = useMemo(
    () =>
      baseSchema.superRefine((data, ctx) => {
        if (showCompanyField && !('id' in data) && !(data as CreateHarvestFormData).companyId?.trim()) {
          addRequiredCompanyIssue(ctx);
        }
      }),
    [baseSchema, showCompanyField],
  );

  const emptyValues: CreateHarvestFormData = {
    companyId: '',
    batchId: '',
    tankId: '',
    harvestDate: todayIso(),
    type: 'partial',
    status: 'completed',
    destination: 'wholesale',
    initialPopulation: 0,
    harvestedQuantity: 0,
    averageWeight: 0,
    sizeClassifications: [{ class: '', quantity: 0, averageWeight: 0, pricePerKg: 0 }],
    clientDestination: '',
    responsible: '',
    operationalCost: 0,
    notes: '',
  };

  const buildFromInitial = (d: Harvest): UpdateHarvestFormData => ({
    id: d.id,
    tankId: d.tankId,
    harvestDate: d.harvestDate,
    type: d.type,
    status: d.status,
    destination: d.destination,
    initialPopulation: d.initialPopulation ?? 0,
    harvestedQuantity: d.harvestedQuantity,
    averageWeight: d.averageWeight,
    sizeClassifications: d.sizeClassifications?.length
      ? d.sizeClassifications.map((c) => ({
          class: c.class,
          quantity: c.quantity,
          averageWeight: c.averageWeight,
          pricePerKg: c.pricePerKg,
        }))
      : [{ class: '', quantity: 0, averageWeight: 0, pricePerKg: 0 }],
    clientDestination: d.clientDestination ?? '',
    responsible: d.responsible ?? '',
    operationalCost: d.operationalCost ?? 0,
    notes: d.notes ?? '',
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<CreateHarvestFormData | UpdateHarvestFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    defaultValues: initialData ? buildFromInitial(initialData) : emptyValues,
  });

  useEffect(() => {
    if (initialData) reset(buildFromInitial(initialData));
  }, [initialData, reset]);

  useEffect(() => {
    if (!apiError) return;
    const field = apiError.field as keyof (CreateHarvestFormData | UpdateHarvestFormData);
    if (apiError.field === 'root') {
      setError('root' as never, { message: apiError.message });
    } else {
      setError(field, { message: apiError.message });
    }
  }, [apiError, setError]);

  const { fields, append, remove } = useFieldArray({
    control: control as never,
    name: 'sizeClassifications',
  });

  // Watched values for live summary
  const companyId = (watch('companyId' as never) ?? '') as unknown as string;
  const batchId = (watch('batchId' as never) ?? '') as unknown as string;
  const harvestedQuantity = (useWatch({ control, name: 'harvestedQuantity' as never }) as number) ?? 0;
  const averageWeight = (useWatch({ control, name: 'averageWeight' as never }) as number) ?? 0;
  const initialPopulation = (useWatch({ control, name: 'initialPopulation' as never }) as number) ?? 0;
  const operationalCost = (useWatch({ control, name: 'operationalCost' as never }) as number) ?? 0;
  const sizeClassifications = useWatch({ control, name: 'sizeClassifications' as never }) as Array<{
    quantity: number;
    averageWeight: number;
    pricePerKg: number;
  }> ?? [];

  // Summary calculations
  const biomassKg = (Number(harvestedQuantity) * Number(averageWeight)) / 1000;
  const grossRevenue = sizeClassifications.reduce((acc, c) => {
    const biomass = (Number(c.quantity) * Number(c.averageWeight)) / 1000;
    return acc + biomass * Number(c.pricePerKg);
  }, 0);
  const netProfit = grossRevenue - Number(operationalCost);
  const survivalRate =
    Number(initialPopulation) > 0
      ? (Number(harvestedQuantity) / Number(initialPopulation)) * 100
      : 0;

  const loadCompanyData = useCallback(
    async (cId: string) => {
      setIsLoadingCompanyData(true);
      setCompanyDataLoaded(false);
      setCompanyBatches([]);
      setCompanyTanks([]);
      try {
        const [batchRes, tankRes] = await Promise.all([
          batchService.getBatches({ page: 1, limit: 1000, companyId: cId }),
          tankService.list({ page: 1, limit: 1000 }),
        ]);
        setCompanyBatches(batchRes.batches);
        setCompanyTanks(tankRes.tanks);
        setCompanyDataLoaded(true);
      } catch {
        showError('Erro ao carregar dados da empresa.');
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
    setValue('batchId' as never, '' as never, { shouldDirty: true });
    setValue('tankId' as never, '' as never, { shouldDirty: true });
    loadCompanyData(companyId);
  }, [companyId, showCompanyField, loadCompanyData, setValue]);

  const selectedBatch = useMemo(() => batches.find((b) => b.id === batchId), [batches, batchId]);

  const typeOptions = useMemo(
    () => Object.entries(HARVEST_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );
  const statusOptions = useMemo(
    () => Object.entries(HARVEST_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );
  const destinationOptions = useMemo(
    () => Object.entries(HARVEST_DESTINATION_LABELS).map(([value, label]) => ({ value, label })),
    [],
  );

  const errs = errors as Record<string, { message?: string }>;
  const classErrs = (
    errors as { sizeClassifications?: Array<Record<string, { message?: string }>> }
  ).sizeClassifications;

  function buildAndSubmit(data: CreateHarvestFormData | UpdateHarvestFormData) {
    if (mode === 'update') {
      const patch: PatchHarvestPayload = { id: (data as UpdateHarvestFormData).id };
      for (const key of Object.keys(dirtyFields) as Array<keyof typeof dirtyFields>) {
        (patch as unknown as Record<string, unknown>)[key] = (data as Record<string, unknown>)[key];
      }
      (onSubmit as (d: PatchHarvestPayload) => void)(patch);
    } else {
      (onSubmit as (d: CreateHarvestFormData) => void)(data as CreateHarvestFormData);
    }
  }

  return (
    <form onSubmit={handleSubmit(buildAndSubmit)} className="space-y-5">
      {errs['root']?.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errs['root'].message}
        </div>
      )}

      {/* Empresa (master only, create only) */}
      {showCompanyField && (
        <Select
          label="Empresa"
          required
          disabled={isLoading || loadingCompanies}
          options={companyOptions}
          placeholder={loadingCompanies ? 'Carregando...' : 'Selecione a empresa'}
          {...register('companyId' as never)}
          error={errs['companyId']?.message}
        />
      )}

      {/* Lote + Tanque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isEditMode ? (
          <Controller
            name={'batchId' as never}
            control={control}
            render={({ field }) => (
              <Select
                label="Lote"
                required
                disabled={isLoading || isLoadingBatchesEffective || (showCompanyField && !companyDataLoaded)}
                placeholder={isLoadingBatchesEffective ? 'Carregando lotes...' : 'Selecione o lote'}
                options={batches.map((b) => ({ value: b.id, label: formatBatchOptionLabel(b) }))}
                value={(field.value as string) || ''}
                onChange={(e) => {
                  const nextId = e.target.value;
                  field.onChange(nextId);
                  const batch = batches.find((b) => b.id === nextId);
                  setValue('tankId' as never, (batch?.tank?.id ?? '') as never, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setValue('initialPopulation' as never, (batch?.initialQuantity ?? 0) as never, {
                    shouldDirty: true,
                  });
                }}
                error={errs['batchId']?.message}
              />
            )}
          />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 flex flex-col justify-center">
            <span className="text-xs text-slate-500 mb-0.5">Lote</span>
            <span className="font-semibold">{initialData?.batchName ?? initialData?.batchId}</span>
          </div>
        )}

        <Controller
          name={'tankId' as never}
          control={control}
          render={({ field }) => {
            const allTanks = showCompanyField ? companyTanks : [];
            if (!isEditMode && selectedBatch?.tank) {
              const tankFromBatch = { id: selectedBatch.tank.id, name: selectedBatch.tank.name };
              const exists = allTanks.some((t) => t.id === tankFromBatch.id);
              if (!exists) allTanks.push(tankFromBatch as Tank);
            }
            return (
              <Select
                label="Tanque"
                required={!isEditMode}
                disabled={isLoading || (showCompanyField && !companyDataLoaded && !isEditMode)}
                placeholder="Selecione o tanque"
                options={
                  allTanks.length > 0
                    ? allTanks.map((t) => ({ value: t.id, label: t.name }))
                    : field.value
                    ? [{ value: field.value as string, label: initialData?.tankName ?? (field.value as string) }]
                    : []
                }
                value={(field.value as string) || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={errs['tankId']?.message}
              />
            );
          }}
        />
      </div>

      {/* Data | Tipo | Status | Destino */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Input
          label="Data"
          type="date"
          required={!isEditMode}
          disabled={isLoading}
          {...register('harvestDate' as never)}
          error={errs['harvestDate']?.message}
        />

        <ControlledSelect
          control={control as never}
          name={'type' as never}
          label="Tipo"
          options={typeOptions}
          error={errs['type']?.message}
        />
        <ControlledSelect
          control={control as never}
          name={'status' as never}
          label="Status"
          options={statusOptions}
          error={errs['status']?.message}
        />
        <ControlledSelect
          control={control as never}
          name={'destination' as never}
          label="Destino"
          options={destinationOptions}
          error={errs['destination']?.message}
        />
      </div>

      {/* População inicial | Qtd. despescada | Peso médio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="População inicial"
          type="number"
          step={1}
          min={0}
          disabled
          readOnly
          {...register('initialPopulation' as never, { valueAsNumber: true })}
          error={errs['initialPopulation']?.message}
        />
        <Input
          label="Qtd. despescada"
          requiredIndicator={!isEditMode}
          type="number"
          step={1}
          min={0}
          disabled={isLoading}
          {...register('harvestedQuantity' as never, { valueAsNumber: true })}
          error={errs['harvestedQuantity']?.message}
        />
        <Input
          label="Peso médio (g)"
          type="number"
          step={0.1}
          min={0}
          disabled={isLoading}
          {...register('averageWeight' as never, { valueAsNumber: true })}
          error={errs['averageWeight']?.message}
        />
      </div>

      {/* Classificação por tamanho */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Classificação por tamanho</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => append({ class: '', quantity: 0, averageWeight: 0, pricePerKg: 0 } as never)}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Adicionar classe
          </Button>
        </div>

        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-px bg-slate-200 text-xs font-medium text-slate-500 uppercase">
            <div className="bg-slate-50 px-3 py-2">Classe</div>
            <div className="bg-slate-50 px-3 py-2 text-right">Quantidade</div>
            <div className="bg-slate-50 px-3 py-2 text-right">Peso médio (g)</div>
            <div className="bg-slate-50 px-3 py-2 text-right">R$ / kg</div>
            <div className="bg-slate-50 px-3 py-2" />
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_100px_100px_100px_40px] gap-px bg-slate-200"
            >
              <div className="bg-white px-2 py-1.5">
                <input
                  type="text"
                  placeholder="G, M, P..."
                  className="w-full rounded border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5"
                  disabled={isLoading}
                  {...register(`sizeClassifications.${index}.class` as never)}
                />
                {classErrs?.[index]?.class?.message && (
                  <p className="text-xs text-red-500 mt-0.5">{classErrs[index].class.message}</p>
                )}
              </div>
              <div className="bg-white px-2 py-1.5">
                <input
                  type="number"
                  min={0}
                  step={1}
                  className="w-full rounded border-0 bg-transparent text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5"
                  disabled={isLoading}
                  {...register(`sizeClassifications.${index}.quantity` as never, { valueAsNumber: true })}
                />
              </div>
              <div className="bg-white px-2 py-1.5">
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  className="w-full rounded border-0 bg-transparent text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5"
                  disabled={isLoading}
                  {...register(`sizeClassifications.${index}.averageWeight` as never, { valueAsNumber: true })}
                />
              </div>
              <div className="bg-white px-2 py-1.5">
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="w-full rounded border-0 bg-transparent text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary px-1 py-0.5"
                  disabled={isLoading}
                  {...register(`sizeClassifications.${index}.pricePerKg` as never, { valueAsNumber: true })}
                />
              </div>
              <div className="bg-white flex items-center justify-center">
                <button
                  type="button"
                  disabled={isLoading || fields.length <= 1}
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 disabled:opacity-30 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cliente / Destino | Responsável */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Cliente / Destino"
          type="text"
          placeholder="Nome do cliente, frigorífico, etc."
          disabled={isLoading}
          {...register('clientDestination' as never)}
          error={errs['clientDestination']?.message}
        />
        <Input
          label="Responsável"
          type="text"
          placeholder="Responsável pela operação"
          disabled={isLoading}
          {...register('responsible' as never)}
          error={errs['responsible']?.message}
        />
      </div>

      {/* Custo operacional */}
      <Input
        label="Custo operacional (R$)"
        type="number"
        step={0.01}
        min={0}
        disabled={isLoading}
        {...register('operationalCost' as never, { valueAsNumber: true })}
        error={errs['operationalCost']?.message}
      />

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <div>
          <p className="text-xs text-slate-500">Biomassa</p>
          <p className="font-semibold">
            {fmt(biomassKg, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Receita bruta</p>
          <p className="font-semibold">{fmtCurrency(grossRevenue)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Lucro líquido</p>
          <p className={`font-semibold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {fmtCurrency(netProfit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Sobrevivência</p>
          <p className="font-semibold">{fmtPct(survivalRate)}</p>
        </div>
      </div>

      {/* Observações */}
      <TextArea
        label="Observações"
        placeholder="Detalhes da despesca..."
        rows={3}
        disabled={isLoading}
        {...register('notes' as never)}
        error={errs['notes']?.message}
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
