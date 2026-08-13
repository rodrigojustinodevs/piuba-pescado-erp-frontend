'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createSpeciesSchema, type CreateSpeciesFormData } from '../schemas';
import { useCreateSpecies } from '../hooks/useCreateSpecies';
import { useUpdateSpecies } from '../hooks/useUpdateSpecies';
import { GrowthCurveFieldArray } from './GrowthCurveFieldArray';
import type { Species } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Loader2 } from 'lucide-react';

export type SpeciesDialogMode = 'create' | 'edit';

interface SpeciesDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly mode?: SpeciesDialogMode;
  readonly species?: Species | null;
}

const optionalNumber = { setValueAs: (v: string) => (v === '' ? undefined : Number(v)) };

const DEFAULT_VALUES: CreateSpeciesFormData = {
  name: '',
  idealTemperatureMin: undefined,
  idealTemperatureMax: undefined,
  idealDissolvedOxygenMin: undefined,
  criticalDissolvedOxygenMin: undefined,
  idealSalinityMin: undefined,
  idealSalinityMax: undefined,
  expectedFcr: undefined,
  maxFeedingRatePctBiomass: undefined,
  growthCurveReference: [],
};

function speciesToForm(species: Species): CreateSpeciesFormData {
  return {
    name: species.name,
    idealTemperatureMin: species.idealTemperatureMin,
    idealTemperatureMax: species.idealTemperatureMax,
    idealDissolvedOxygenMin: species.idealDissolvedOxygenMin,
    criticalDissolvedOxygenMin: species.criticalDissolvedOxygenMin,
    idealSalinityMin: species.idealSalinityMin,
    idealSalinityMax: species.idealSalinityMax,
    expectedFcr: species.expectedFcr,
    maxFeedingRatePctBiomass: species.maxFeedingRatePctBiomass,
    growthCurveReference: species.growthCurveReference ?? [],
  };
}

export function SpeciesDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  species = null,
}: Readonly<SpeciesDialogProps>) {
  const createSpecies = useCreateSpecies();
  const updateSpecies = useUpdateSpecies();
  const saving = createSpecies.isPending || updateSpecies.isPending;
  const isEdit = mode === 'edit';

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateSpeciesFormData>({
    resolver: zodResolver(createSpeciesSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(species ? speciesToForm(species) : DEFAULT_VALUES);
  }, [open, species, reset]);

  function onSubmit(data: CreateSpeciesFormData) {
    if (isEdit) {
      if (!species?.id) return;
      updateSpecies.mutate(
        { id: species.id, ...data },
        {
          onSuccess: () => {
            onOpenChange(false);
            onSuccess?.();
          },
        },
      );
      return;
    }

    createSpecies.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }

  function handleClose(value: boolean) {
    if (!value) reset(DEFAULT_VALUES);
    onOpenChange(value);
  }

  const title = isEdit ? 'Editar Espécie' : 'Nova Espécie';
  const description = isEdit
    ? 'Atualize os parâmetros biológicos de referência da espécie.'
    : 'Preencha os dados para cadastrar uma nova espécie.';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Dados da espécie</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Nome"
                  requiredIndicator
                  placeholder="Ex: Tilápia"
                  disabled={saving}
                  {...register('name')}
                  error={errors.name?.message}
                />
              </div>

              <Input
                label="Temperatura ideal mín. (°C)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('idealTemperatureMin', optionalNumber)}
                error={errors.idealTemperatureMin?.message}
              />
              <Input
                label="Temperatura ideal máx. (°C)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('idealTemperatureMax', optionalNumber)}
                error={errors.idealTemperatureMax?.message}
              />
              <Input
                label="Oxigênio dissolvido ideal mín. (mg/L)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('idealDissolvedOxygenMin', optionalNumber)}
                error={errors.idealDissolvedOxygenMin?.message}
              />
              <Input
                label="Oxigênio dissolvido crítico mín. (mg/L)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('criticalDissolvedOxygenMin', optionalNumber)}
                error={errors.criticalDissolvedOxygenMin?.message}
              />
              <Input
                label="Salinidade ideal mín. (ppt)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('idealSalinityMin', optionalNumber)}
                error={errors.idealSalinityMin?.message}
              />
              <Input
                label="Salinidade ideal máx. (ppt)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('idealSalinityMax', optionalNumber)}
                error={errors.idealSalinityMax?.message}
              />
              <Input
                label="FCR esperado"
                type="number"
                step={0.01}
                disabled={saving}
                {...register('expectedFcr', optionalNumber)}
                error={errors.expectedFcr?.message}
              />
              <Input
                label="Taxa máx. de arraçoamento (% biomassa)"
                type="number"
                step={0.1}
                disabled={saving}
                {...register('maxFeedingRatePctBiomass', optionalNumber)}
                error={errors.maxFeedingRatePctBiomass?.message}
              />
            </div>

            <GrowthCurveFieldArray
              control={control}
              register={register}
              errors={errors}
              disabled={saving}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
