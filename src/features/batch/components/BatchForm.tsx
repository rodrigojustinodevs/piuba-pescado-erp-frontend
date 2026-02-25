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
import { FormActions } from '@/shared/components/form';
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
          name: initialData.name ?? '',
          description: initialData.description ?? '',
          tankId: initialData.tank?.id ?? '',
          entryDate: initialData.entryDate ? initialData.entryDate.split('T')[0] : '',
          initialQuantity: initialData.initialQuantity,
          species: initialData.species,
          cultivation: initialData.cultivation,
        }
      : {
          name: '',
          description: '',
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
        name: initialData.name ?? '',
        description: initialData.description ?? '',
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
          <Input
            label="Nome do Lote"
            requiredIndicator
            placeholder="Ex: Lote 01 - Tilápia"
            disabled={isLoading}
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Descrição"
            requiredIndicator
            placeholder="Ex: Lote de alevinos recebidos em out/2024"
            disabled={isLoading}
            {...register('description')}
            error={errors.description?.message}
          />

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

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={isEditMode ? 'Atualizando...' : 'Criando...'}
        isLoading={isLoading}
      />
    </form>
  );
}
