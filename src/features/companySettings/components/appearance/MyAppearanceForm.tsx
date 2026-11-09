'use client';

import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LOCALE_OPTIONS, THEME_OPTIONS } from '../../constants/options';
import { useSectionSave } from '../../hooks/useSectionSave';
import { companySettingsService } from '../../services/companySettingsService';
import type { CompanySettings, Locale, Theme, UserAppearancePayload } from '../../types';
import { Field, SelectField } from '../fields';
import { ReadOnlyNotice } from '../ReadOnlyNotice';
import { SettingsCard } from '../SettingsCard';
import { ThemeChoice, type ThemeChoiceValue } from './ThemeChoice';

/** Sentinela de "Seguir a empresa" (`null` na API). */
const FOLLOW = 'company';

type FormValues = { theme: ThemeChoiceValue; locale: string };

function toPayload(values: FormValues): UserAppearancePayload {
  return {
    theme: values.theme === FOLLOW ? null : (values.theme as Theme),
    locale: values.locale === FOLLOW ? null : (values.locale as Locale),
  };
}

function label<T extends string>(options: Array<{ value: T; label: string }>, value: T): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

type Props = Readonly<{
  settings: CompanySettings;
  editable: boolean;
  onSaved: (settings: CompanySettings) => void;
}>;

/** Vale só para o usuário logado, na empresa ativa. Só master_admin altera. */
export function MyAppearanceForm({ settings, editable, onSaved }: Props) {
  const { user, company } = settings.appearance;
  const values = useMemo<FormValues>(
    () => ({ theme: user.theme ?? FOLLOW, locale: user.locale ?? FOLLOW }),
    [user.theme, user.locale],
  );
  const form = useForm<FormValues>({ values });
  const { readOnly, isSaving } = useSectionSave({
    id: 'user-appearance',
    form,
    editable,
    toPayload,
    mutationFn: companySettingsService.updateUserAppearance,
    onSaved,
  });

  const themeOptions = useMemo(
    () => [
      {
        value: FOLLOW as ThemeChoiceValue,
        label: 'Seguir a empresa',
        description: label(THEME_OPTIONS, company.theme),
      },
      ...THEME_OPTIONS,
    ],
    [company.theme],
  );
  const localeOptions = useMemo(
    () => [
      {
        value: FOLLOW,
        label: `Seguir a empresa (${label(LOCALE_OPTIONS, settings.general.locale)})`,
      },
      ...LOCALE_OPTIONS,
    ],
    [settings.general.locale],
  );

  return (
    <SettingsCard
      title="Minha preferência"
      description="Só para você, nesta empresa. Sobrepõe o padrão da empresa."
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
              onChange={field.onChange}
              options={themeOptions}
              disabled={readOnly || isSaving}
            />
          )}
        />
        <Field
          label="Idioma de formatação"
          hint="Define como números, moeda e datas aparecem para você."
          className="max-w-sm"
        >
          <Controller
            control={form.control}
            name="locale"
            render={({ field }) => (
              <SelectField
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                options={localeOptions}
                disabled={readOnly || isSaving}
              />
            )}
          />
        </Field>
      </div>
    </SettingsCard>
  );
}
