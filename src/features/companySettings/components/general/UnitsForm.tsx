'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TEMPERATURE_OPTIONS, VOLUME_OPTIONS, WEIGHT_OPTIONS } from '../../constants/options';
import { useSectionSave } from '../../hooks/useSectionSave';
import { type UnitsFormValues, unitsSchema } from '../../schemas';
import { companySettingsService } from '../../services/companySettingsService';
import type { CompanySettings } from '../../types';
import { toUnitsPayload } from '../../utils/mappers';
import { Field, SelectField } from '../fields';
import { ReadOnlyNotice } from '../ReadOnlyNotice';
import { SettingsCard } from '../SettingsCard';

type Props = Readonly<{
  settings: CompanySettings;
  editable: boolean;
  onSaved: (settings: CompanySettings) => void;
}>;

const FIELDS = [
  { name: 'weightUnit', label: 'Peso', options: WEIGHT_OPTIONS },
  { name: 'volumeUnit', label: 'Volume', options: VOLUME_OPTIONS },
  { name: 'temperatureUnit', label: 'Temperatura', options: TEMPERATURE_OPTIONS },
] as const;

export function UnitsForm({ settings, editable, onSaved }: Props) {
  const { weightUnit, volumeUnit, temperatureUnit } = settings.units;
  const values = useMemo<UnitsFormValues>(
    () => ({ weightUnit, volumeUnit, temperatureUnit }),
    [weightUnit, volumeUnit, temperatureUnit],
  );

  const form = useForm<UnitsFormValues>({ resolver: zodResolver(unitsSchema), values });
  const { readOnly, isSaving } = useSectionSave({
    id: 'units',
    form,
    editable,
    toPayload: toUnitsPayload,
    mutationFn: companySettingsService.updateUnits,
    onSaved,
  });
  const disabled = readOnly || isSaving;
  const { errors } = form.formState;

  return (
    <SettingsCard
      title="Unidades de medida"
      description="Padrões usados em relatórios e formulários."
      aside={readOnly ? <ReadOnlyNotice /> : null}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {FIELDS.map(({ name, label, options }) => (
          <Field key={name} label={label} error={errors[name]?.message}>
            <Controller
              control={form.control}
              name={name}
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={[...options]}
                  disabled={disabled}
                />
              )}
            />
          </Field>
        ))}
      </div>
      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Altera apenas a forma de exibição. Os valores já registrados não são modificados.
      </p>
    </SettingsCard>
  );
}
