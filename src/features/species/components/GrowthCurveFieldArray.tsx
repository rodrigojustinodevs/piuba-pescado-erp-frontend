'use client';

import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { CreateSpeciesFormData } from '../schemas';
import { Input } from '@/shared/components/ui';
import { Plus, Trash } from 'lucide-react';

type GrowthCurveFieldArrayProps = {
  control: Control<CreateSpeciesFormData>;
  register: UseFormRegister<CreateSpeciesFormData>;
  errors: FieldErrors<CreateSpeciesFormData>;
  disabled?: boolean;
};

export function GrowthCurveFieldArray({
  control,
  register,
  errors,
  disabled,
}: Readonly<GrowthCurveFieldArrayProps>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'growthCurveReference',
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-[#0F172A]">Curva de crescimento</label>
        <button
          type="button"
          disabled={disabled}
          onClick={() => append({ day: 0, weightG: 0 })}
          className="flex items-center gap-1 text-sm font-medium text-[#0EA5A4] hover:text-[#0F766E] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Adicionar ponto
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-slate-500 mb-2">Nenhum ponto de referência adicionado.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-3">
            <Input
              label="Dia"
              type="number"
              step={1}
              min={0}
              disabled={disabled}
              defaultValue={field.day}
              {...register(`growthCurveReference.${index}.day`, { valueAsNumber: true })}
              error={errors.growthCurveReference?.[index]?.day?.message}
            />
            <Input
              label="Peso (g)"
              type="number"
              step={0.01}
              min={0}
              disabled={disabled}
              defaultValue={field.weightG}
              {...register(`growthCurveReference.${index}.weightG`, {
                valueAsNumber: true,
              })}
              error={errors.growthCurveReference?.[index]?.weightG?.message}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => remove(index)}
              className="mb-2.5 p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
              aria-label="Remover ponto"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
