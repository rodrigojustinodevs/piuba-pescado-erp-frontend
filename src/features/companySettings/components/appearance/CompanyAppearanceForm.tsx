'use client';

import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { THEME_OPTIONS } from '../../constants/options';
import { useSectionSave } from '../../hooks/useSectionSave';
import { HEX_COLOR } from '../../schemas';
import { companySettingsService } from '../../services/companySettingsService';
import type { CompanyAppearancePayload, CompanySettings, Theme } from '../../types';
import { Field, TextField } from '../fields';
import { ReadOnlyNotice } from '../ReadOnlyNotice';
import { SettingsCard } from '../SettingsCard';
import { ThemeChoice } from './ThemeChoice';

/** Só para o color picker quando a empresa usa a cor do produto. */
const PICKER_PLACEHOLDER = '#0EA5A4';

type FormValues = { theme: Theme; useDefaultColor: boolean; primaryColor: string };

function toPayload(values: FormValues): CompanyAppearancePayload {
  return {
    theme: values.theme,
    primaryColor: values.useDefaultColor ? null : values.primaryColor.toUpperCase(),
  };
}

type Props = Readonly<{
  settings: CompanySettings;
  editable: boolean;
  onSaved: (settings: CompanySettings) => void;
}>;

export function CompanyAppearanceForm({ settings, editable, onSaved }: Props) {
  const { theme, primaryColor } = settings.appearance.company;
  const values = useMemo<FormValues>(
    () => ({
      theme,
      useDefaultColor: primaryColor === null,
      primaryColor: primaryColor ?? PICKER_PLACEHOLDER,
    }),
    [theme, primaryColor],
  );
  const form = useForm<FormValues>({ values });
  const { readOnly, isSaving } = useSectionSave({
    id: 'appearance',
    form,
    editable,
    toPayload,
    mutationFn: companySettingsService.updateCompanyAppearance,
    onSaved,
  });
  const disabled = readOnly || isSaving;
  const useDefaultColor = useWatch({ control: form.control, name: 'useDefaultColor' });
  const { errors } = form.formState;

  return (
    <SettingsCard
      title="Padrão da empresa"
      description="Tema e cor usados por todos da empresa."
      aside={readOnly ? <ReadOnlyNotice /> : null}
    >
      <div className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="theme"
          render={({ field }) => (
            <ThemeChoice
              legend="Tema"
              value={field.value}
              onChange={(v) => field.onChange(v as Theme)}
              options={THEME_OPTIONS}
              disabled={disabled}
            />
          )}
        />

        <div className="flex flex-col gap-3">
          <Controller
            control={form.control}
            name="useDefaultColor"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  disabled={disabled}
                />
                Usar a cor padrão do produto
              </label>
            )}
          />
          {useDefaultColor ? null : (
            <Controller
              control={form.control}
              name="primaryColor"
              rules={{ pattern: { value: HEX_COLOR, message: 'Use o formato #RRGGBB.' } }}
              render={({ field }) => (
                <Field
                  label="Cor principal"
                  error={errors.primaryColor?.message}
                  className="max-w-xs"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Escolher cor principal"
                      value={HEX_COLOR.test(field.value) ? field.value : PICKER_PLACEHOLDER}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      disabled={disabled}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-input bg-background p-1 disabled:cursor-not-allowed"
                    />
                    <TextField
                      name={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      onBlur={field.onBlur}
                      maxLength={7}
                      spellCheck={false}
                      autoComplete="off"
                      disabled={disabled}
                      className="font-mono uppercase"
                    />
                  </div>
                </Field>
              )}
            />
          )}
        </div>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          Vale para todos os usuários que não escolheram uma preferência pessoal.
        </p>
      </div>
    </SettingsCard>
  );
}
