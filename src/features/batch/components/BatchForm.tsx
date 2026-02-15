'use client';

import { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBatchSchema,
  updateBatchSchema,
  type CreateBatchFormData,
  type UpdateBatchFormData,
} from '../schemas';
import type { Batch } from '../types';
import { useTanks } from '@/features/tank';
import { Input, Select } from '@/shared/components/ui';

type BatchFormCommonProps = {
  isLoading?: boolean;
  submitLabel?: string;
};

export type BatchFormProps =
  | (BatchFormCommonProps & {
      mode: 'create';
      initialData?: never;
      onSubmit: (data: CreateBatchFormData) => void;
    })
  | (BatchFormCommonProps & {
      mode: 'update';
      initialData: Batch;
      onSubmit: (data: UpdateBatchFormData) => void;
    });

export function BatchForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Salvar',
}: BatchFormProps) {
  const { data: tanksData, isLoading: isLoadingTanks } = useTanks({
    limit: 1000,
  });
  const tanks = tanksData?.tanks || [];

  const isEditMode = mode === 'update';
  const schema = isEditMode ? updateBatchSchema : createBatchSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateBatchFormData | UpdateBatchFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData
      ? {
          id: initialData.id,
          tankId: initialData.tank?.id ?? '',
          entryDate: initialData.entryDate ? initialData.entryDate.split('T')[0] : '',
          initialQuantity: initialData.initialQuantity,
          species: initialData.species,
          cultivation: initialData.cultivation,
        }
      : {
          tankId: '',
          entryDate: '',
          initialQuantity: 0,
          species: '',
          cultivation: '',
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        tankId: initialData.tank?.id ?? '',
        entryDate: initialData.entryDate ? initialData.entryDate.split('T')[0] : '',
        initialQuantity: initialData.initialQuantity,
        species: initialData.species,
        cultivation: initialData.cultivation,
      });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit as unknown as SubmitHandler<CreateBatchFormData | UpdateBatchFormData>,
      )}
      className="space-y-6"
    >
      {/* Informações do Lote */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Informações do Lote</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="tankId"
            control={control}
            render={({ field }) => (
              <Select
                label="Tanque"
                requiredIndicator
                disabled={isLoadingTanks}
                placeholder={isLoadingTanks ? 'Carregando tanques...' : 'Selecione um tanque'}
                options={tanks.map((tank) => ({
                  value: String(tank.id),
                  label: tank.name,
                }))}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors.tankId?.message}
              />
            )}
          />

          <Input
            label="Data de Entrada"
            requiredIndicator
            type="date"
            disabled={isLoading}
            {...register('entryDate')}
            error={errors.entryDate?.message}
          />

          <Input
            label="Quantidade Inicial"
            requiredIndicator
            type="number"
            step={1}
            min={1}
            disabled={isLoading}
            {...register('initialQuantity', { valueAsNumber: true })}
            error={errors.initialQuantity?.message}
          />

          <Input
            label="Espécie"
            requiredIndicator
            placeholder="Ex: Tilapia"
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
                  label="Tipo de Cultivo"
                  requiredIndicator
                  placeholder="Selecione o tipo de cultivo"
                  options={[
                    { value: 'daycare', label: 'Berçário' },
                    // Adicione outros tipos conforme necessário
                  ]}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isLoading}
                  error={errors.cultivation?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-[#0EA5A4] rounded-lg hover:bg-[#0F766E] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          )}
          {isLoading ? (isEditMode ? 'Atualizando...' : 'Criando...') : submitLabel}
        </button>
      </div>
    </form>
  );
}
