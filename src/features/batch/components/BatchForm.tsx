'use client';

import { useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  batchDistributionSchema,
  createBatchSchema,
  type BatchDistributionFormData,
  type CreateBatchFormData,
} from '../schemas';
import type { Batch, BatchCultivation } from '../types';
import { Tank, useTanksWithoutBatches } from '@/features/tank';
import { useSuppliers } from '@/features/supplier';
import { FormActions } from '@/shared/components/form';
import { toast } from 'sonner';
import { Label } from '@/shared/components/ui/Label';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { Input } from '@/shared/components/ui/Input';
import { Textarea } from '@/shared/components/ui/Textarea';
import { Plus, Trash } from 'lucide-react';
import { Supplier } from '../../supplier/types';

// ─── Constants ────────────────────────────────────────────────────────────────

const CULTIVATION_OPTIONS: { value: BatchCultivation; label: string }[] = [
  { value: 'growout', label: 'Engorda' },
  /** Backend costuma enviar `daycare`; o formulário antigo usava `nursery` — mantemos os dois valores. */
  { value: 'nursery', label: 'Berçário' },
  { value: 'broodstock', label: 'Reprodução' },
  { value: 'larviculture', label: 'Larvicultura' },
];

const VALID_CULTIVATIONS: BatchCultivation[] = ['growout', 'nursery', 'broodstock', 'larviculture'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function normalizeCultivation(value?: string | null): BatchCultivation {
  const normalized = value?.trim().toLowerCase() as BatchCultivation | undefined;
  return normalized && VALID_CULTIVATIONS.includes(normalized) ? normalized : 'growout';
}

function emptySimple(): CreateBatchFormData {
  return {
    tankId: '',
    name: '',
    description: '',
    entryDate: today(),
    initialQuantity: 0,
    species: '',
    cultivation: '',
  };
}

function emptyDistributed(): BatchDistributionFormData {
  return {
    supplierId: '',
    totalCost: 0,
    entryDate: today(),
    species: '',
    cultivation: '',
    notes: '',
    distribution: [{ tankId: '', quantity: 0, averageWeight: 0 }],
  };
}

function batchToSimpleFormData(batch: Batch): CreateBatchFormData {
  return {
    tankId: String(batch.tank?.id ?? ''),
    name: batch.name ?? '',
    description: batch.description ?? '',
    entryDate: batch.entryDate?.slice(0, 10) ?? today(),
    initialQuantity: batch.initialQuantity,
    species: batch.species,
    cultivation: normalizeCultivation(batch.cultivation), // nunca retorna ''
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type BatchFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
};

export type BatchFormProps =
  | (BatchFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateBatchFormData | BatchDistributionFormData) => void;
    })
  | (BatchFormCommonProps & {
      mode: 'edit' | 'update' | 'view';
      initialData?: Batch;
      onSubmit: (data: CreateBatchFormData) => void;
    });

// ─── Component ────────────────────────────────────────────────────────────────

export function BatchForm({
  mode,
  initialData,
  isLoading = false,
  submitLabel = 'Salvar',
  onCancel,
  onSubmit,
}: BatchFormProps) {
  const isEdit = mode === 'edit' || mode === 'update';
  const isView = mode === 'view';

  const [tab, setTab] = useState<'simple' | 'distributed'>('simple');
  const [submitting, setSubmitting] = useState(false);
  // ─── Data fetching ──────────────────────────────────────────────────────────

  const { data: tanksData, isLoading: isLoadingTanks } = useTanksWithoutBatches({
    page: 1,
    per_page: 1000,
  });

  const tanks = useMemo<Tank[]>(() => {
    const available = tanksData?.tanks ?? [];
    if (!isEdit || !initialData?.tank) return available;

    const currentTankId = String(initialData.tank.id);
    const hasCurrentTank = available.some((t) => String(t.id) === currentTankId);
    return hasCurrentTank ? available : [initialData.tank as unknown as Tank, ...available];
  }, [tanksData?.tanks, isEdit, initialData]);

  const { data: suppliersData } = useSuppliers({ page: 1, limit: 1000 });
  const suppliers: Supplier[] = suppliersData?.suppliers ?? [];

  // ─── Forms ──────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateBatchFormData>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: useMemo(
      () =>
        initialData && (mode === 'edit' || mode === 'update')
          ? batchToSimpleFormData(initialData)
          : emptySimple(),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [], // intencional: só na montagem
    ),
  });

  const {
    register: registerDistributed,
    control: distributedControl,
    handleSubmit: handleSubmitDistributed,
    formState: { errors: distributedErrors },
    watch: watchDistributed,
    reset: resetDistributed,
  } = useForm<BatchDistributionFormData>({
    resolver: zodResolver(batchDistributionSchema),
    defaultValues: emptyDistributed(),
  });

  const { fields, append, remove } = useFieldArray({
    control: distributedControl,
    name: 'distribution',
  });

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isEdit) {
      reset(emptySimple());
      resetDistributed(emptyDistributed());
      return;
    }

    if (!initialData) return;

    reset(batchToSimpleFormData(initialData));
    setTab('simple');
  }, [isEdit, initialData?.id, reset, resetDistributed]);
  // ─── Derived state ──────────────────────────────────────────────────────────

  const totalDistributed = useMemo(
    () =>
      watchDistributed('distribution')?.reduce(
        (sum, row) => sum + (Number(row.quantity) || 0),
        0,
      ) ?? 0,
    [watchDistributed],
  );

  // ─── Submit handlers ────────────────────────────────────────────────────────

  const submitSimple = async (data: CreateBatchFormData) => {
    setSubmitting(true);
    try {
      onSubmit(data);
      toast.success(isEdit ? 'Lote atualizado com sucesso!' : 'Lote criado com sucesso!');
    } catch {
      toast.error(isEdit ? 'Erro ao atualizar lote.' : 'Erro ao criar lote.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitDistributed = async (data: BatchDistributionFormData) => {
    setSubmitting(true);
    try {
      onSubmit(data as unknown as CreateBatchFormData);
      toast.success(`Lote distribuído em ${data.distribution.length} viveiro(s) criado!`);
    } catch {
      toast.error('Erro ao criar lote distribuído.');
    } finally {
      setSubmitting(false);
    }
  };

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEdit || tab === 'simple') {
      void handleSubmit(submitSimple, (errors) => {
        const message = Object.values(errors)[0]?.message;
        if (message) toast.error(String(message));
      })();
      return;
    }

    void handleSubmitDistributed(submitDistributed, (errors) => {
      const distributionErrors = Array.isArray(errors.distribution) ? errors.distribution : [];
      const rowError = distributionErrors.find(Boolean);
      const message =
        rowError?.tankId?.message ??
        rowError?.quantity?.message ??
        rowError?.averageWeight?.message ??
        Object.values(errors)[0]?.message;

      if (message) toast.error(String(message));
    })();
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'simple' | 'distributed')}>
        {!isEdit && !isView && (
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simples</TabsTrigger>
            <TabsTrigger value="distributed">Distribuído</TabsTrigger>
          </TabsList>
        )}

        {/* ── Tab: Simples ── */}
        <TabsContent value="simple" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="s-name">Nome do lote *</Label>
              <Input
                id="s-name"
                placeholder="Ex: Lote Tilápia 001"
                disabled={isView}
                {...register('name')}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tankId">Viveiro *</Label>
              <Controller
                name="tankId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onValueChange={field.onChange}
                    disabled={isView || isLoadingTanks}
                  >
                    <SelectTrigger id="tankId">
                      <SelectValue
                        placeholder={
                          isLoadingTanks ? 'Carregando viveiros...' : 'Selecione o viveiro'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {tanks.map((tank) => (
                        <SelectItem key={String(tank.id)} value={String(tank.id)}>
                          {tank.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tankId && <p className="text-xs text-destructive">{errors.tankId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-species">Espécie *</Label>
              <Input
                id="s-species"
                placeholder="Ex: Tilápia do Nilo"
                disabled={isView}
                {...register('species')}
              />
              {errors.species && (
                <p className="text-xs text-destructive">{errors.species.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-qty">Quantidade inicial *</Label>
              <Input
                id="s-qty"
                type="number"
                min={1}
                placeholder="0"
                disabled={isView}
                {...register('initialQuantity', { valueAsNumber: true })}
              />
              {errors.initialQuantity && (
                <p className="text-xs text-destructive">{errors.initialQuantity.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="s-date">Data de entrada *</Label>
              <Input id="s-date" type="date" disabled={isView} {...register('entryDate')} />
              {errors.entryDate && (
                <p className="text-xs text-destructive">{errors.entryDate.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="s-cultivation">Tipo de cultivo *</Label>
              <Controller
                name="cultivation"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onValueChange={field.onChange}
                    disabled={isView}
                  >
                    <SelectTrigger id="s-cultivation">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CULTIVATION_OPTIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="s-desc">Descrição</Label>
              <Textarea
                id="s-desc"
                rows={3}
                placeholder="Observações sobre o lote..."
                disabled={isView}
                {...register('description')}
              />
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Distribuído ── */}
        <TabsContent value="distributed" className="space-y-4 pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="d-supplier">Fornecedor *</Label>
              <Controller
                name="supplierId"
                control={distributedControl}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onValueChange={field.onChange}
                    disabled={isView}
                  >
                    <SelectTrigger id="d-supplier">
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s) => (
                        <SelectItem key={String(s.id)} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {distributedErrors.supplierId && (
                <p className="text-xs text-destructive">{distributedErrors.supplierId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-species">Espécie *</Label>
              <Input
                id="d-species"
                placeholder="Ex: Tilápia"
                disabled={isView}
                {...registerDistributed('species')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-cost">Custo total (R$) *</Label>
              <Input
                id="d-cost"
                type="number"
                min={0}
                step="0.01"
                placeholder="0,00"
                disabled={isView}
                {...registerDistributed('totalCost', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-date">Data de entrada *</Label>
              <Input
                id="d-date"
                type="date"
                disabled={isView}
                {...registerDistributed('entryDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="d-cultivation">Tipo de cultivo *</Label>
              <Controller
                name="cultivation"
                control={distributedControl}
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? '')}
                    onValueChange={field.onChange}
                    disabled={isView || isLoading}
                  >
                    <SelectTrigger id="d-cultivation">
                      <SelectValue placeholder="Selecione o tipo de cultivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {CULTIVATION_OPTIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="d-notes">Observações</Label>
              <Textarea
                id="d-notes"
                rows={2}
                placeholder="Notas sobre a compra ou distribuição..."
                disabled={isView}
                {...registerDistributed('notes')}
              />
            </div>
          </div>

          {/* ── Distribution rows ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-semibold">Distribuição por viveiro</Label>
                <p className="text-xs text-muted-foreground">
                  Total: {totalDistributed.toLocaleString('pt-BR')} animais
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isView}
                onClick={() => append({ tankId: '', quantity: 0, averageWeight: 0 })}
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((row, idx) => (
                <DistributionRow
                  key={row.id}
                  idx={idx}
                  tanks={tanks}
                  control={distributedControl}
                  register={registerDistributed}
                  isView={isView}
                  canRemove={fields.length > 1}
                  onRemove={() => remove(idx)}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={isEdit ? 'Atualizando...' : 'Criando...'}
        isLoading={isLoading || submitting}
        onCancel={onCancel}
      />
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

type DistributionRowProps = {
  idx: number;
  tanks: Tank[];
  control: ReturnType<typeof useForm<BatchDistributionFormData>>['control'];
  register: ReturnType<typeof useForm<BatchDistributionFormData>>['register'];
  isView: boolean;
  canRemove: boolean;
  onRemove: () => void;
};

function DistributionRow({
  idx,
  tanks,
  control,
  register,
  isView,
  canRemove,
  onRemove,
}: Readonly<DistributionRowProps>) {
  return (
    <div className="rounded-md border p-3 grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      <div className="space-y-1.5">
        <Label className="text-xs">Viveiro *</Label>
        <Controller
          name={`distribution.${idx}.tankId`}
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={isView}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {tanks.map((t) => (
                  <SelectItem key={String(t.id)} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Quantidade *</Label>
        <Input
          type="number"
          min={1}
          placeholder="0"
          disabled={isView}
          {...register(`distribution.${idx}.quantity`, { valueAsNumber: true })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Peso médio (kg) *</Label>
        <Input
          type="number"
          min={0}
          step="0.001"
          placeholder="0,025"
          disabled={isView}
          {...register(`distribution.${idx}.averageWeight`, { valueAsNumber: true })}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isView || !canRemove}
        onClick={onRemove}
        className="text-destructive hover:text-destructive"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  );
}
