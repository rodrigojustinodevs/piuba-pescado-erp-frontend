'use client';

import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { batchDistributionSchema, type BatchDistributionFormData } from '../schemas';
import { useSuppliers } from '@/features/supplier';
import { useTanksWithoutBatches } from '@/features/tank';
import { FormActions, Select } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

const CULTIVATION_OPTIONS = [
  { value: 'growout', label: 'Engorda' },
  { value: 'nursery', label: 'Viveiro' },
];

type BatchDistributionFormProps = {
  onSubmit: (data: BatchDistributionFormData) => void;
  isLoading?: boolean;
};

export function BatchDistributionForm({
  onSubmit,
  isLoading = false,
}: Readonly<BatchDistributionFormProps>) {
  const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers({
    page: 1,
    limit: 500,
  });
  const { data: tanksData, isLoading: isLoadingTanks } = useTanksWithoutBatches({
    page: 1,
    perPage: 500,
  });

  const suppliers = suppliersData?.suppliers ?? [];
  const tanks = tanksData?.tanks ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BatchDistributionFormData>({
    resolver: zodResolver(batchDistributionSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      supplierId: '',
      totalCost: 0,
      entryDate: '',
      species: '',
      cultivation: '',
      notes: '',
      distribution: [{ tankId: '', quantity: 1, averageWeight: 0.02 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'distribution',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dados da entrada</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="supplierId"
            control={control}
            render={({ field }) => (
              <Select
                label="Fornecedor"
                required
                disabled={isLoadingSuppliers || isLoading}
                placeholder={
                  isLoadingSuppliers ? 'Carregando fornecedores...' : 'Selecione o fornecedor'
                }
                options={suppliers.map((s) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors.supplierId?.message}
              />
            )}
          />

          <Input
            label="Custo total (R$)"
            requiredIndicator
            type="number"
            step="0.01"
            min={0}
            disabled={isLoading}
            {...register('totalCost', { valueAsNumber: true })}
            error={errors.totalCost?.message}
          />

          <Input
            label="Data de entrada"
            requiredIndicator
            type="date"
            disabled={isLoading}
            {...register('entryDate')}
            error={errors.entryDate?.message}
          />

          <Input
            label="Espécie"
            requiredIndicator
            placeholder="Ex.: Pacific White Shrimp"
            disabled={isLoading}
            {...register('species')}
            error={errors.species?.message}
          />

          <div className="md:col-span-2">
            <Controller
              name="cultivation"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de cultivo"
                  required
                  placeholder="Selecione o tipo de cultivo"
                  options={CULTIVATION_OPTIONS}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isLoading}
                  error={errors.cultivation?.message}
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="batch-distribution-notes"
              className="mb-1 block text-sm font-medium text-[#0F172A]"
            >
              Observações
            </label>
            <textarea
              id="batch-distribution-notes"
              rows={3}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-[#0F172A] transition focus:border-[#0EA5A4] focus:outline-none focus:ring-2 focus:ring-[#0EA5A4]"
              placeholder="Ex.: Origem do lote, referência de nota, etc."
              {...register('notes')}
            />
            {errors.notes?.message ? (
              <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Distribuição por tanque</h3>
            <p className="mt-1 text-sm text-slate-500">
              Apenas tanques sem lote ativo aparecem na lista. Informe quantidade e peso médio por
              tanque.
            </p>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => append({ tankId: '', quantity: 1, averageWeight: 0.02 })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50 disabled:opacity-50"
          >
            Adicionar tanque
          </button>
        </div>

        {errors.distribution?.message ? (
          <p className="text-sm text-red-600">{errors.distribution.message}</p>
        ) : null}

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 md:grid-cols-12 md:items-end"
            >
              <div className="md:col-span-5">
                <Controller
                  name={`distribution.${index}.tankId`}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      label="Tanque"
                      required
                      disabled={isLoadingTanks || isLoading}
                      placeholder={
                        isLoadingTanks ? 'Carregando tanques sem lote...' : 'Selecione o tanque'
                      }
                      options={tanks.map((t) => ({
                        value: String(t.id),
                        label: t.name,
                      }))}
                      value={f.value || ''}
                      onChange={(e) => f.onChange(e.target.value)}
                      error={errors.distribution?.[index]?.tankId?.message}
                    />
                  )}
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  label="Quantidade"
                  requiredIndicator
                  type="number"
                  step={1}
                  min={1}
                  disabled={isLoading}
                  {...register(`distribution.${index}.quantity`, { valueAsNumber: true })}
                  error={errors.distribution?.[index]?.quantity?.message}
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  label="Peso médio (kg)"
                  requiredIndicator
                  type="number"
                  step="0.001"
                  min={0}
                  disabled={isLoading}
                  {...register(`distribution.${index}.averageWeight`, { valueAsNumber: true })}
                  error={errors.distribution?.[index]?.averageWeight?.message}
                />
              </div>
              <div className="flex md:col-span-1 md:justify-end">
                <button
                  type="button"
                  disabled={isLoading || fields.length <= 1}
                  onClick={() => remove(index)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-40"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormActions
        submitLabel="Registrar entrada"
        loadingLabel="Registrando..."
        isLoading={isLoading}
      />
    </form>
  );
}
