'use client';

import { Info } from 'lucide-react';
import { useId, useMemo } from 'react';
import { Controller, useForm, useWatch, type Control } from 'react-hook-form';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/utils';
import { FREQUENCY_OPTIONS } from '../../constants/options';
import { useSettingsCache } from '../../hooks/queries';
import { useSectionSave } from '../../hooks/useSectionSave';
import { companySettingsService } from '../../services/companySettingsService';
import type { NotificationPreference, NotificationsPayload } from '../../types';
import { Field, SelectField } from '../fields';
import { SettingsCard } from '../SettingsCard';

type FormValues = { preferences: NotificationPreference[] };

/** Sempre a lista completa, uma entrada por categoria; `label` é só de exibição. */
function toPayload(values: FormValues): NotificationsPayload {
  return {
    preferences: values.preferences.map(({ category, enabled, channels, frequency }) => ({
      category,
      enabled,
      channels: { inApp: channels.inApp, email: channels.email },
      frequency,
    })),
  };
}

type RowProps = Readonly<{
  index: number;
  label: string;
  control: Control<FormValues>;
  disabled: boolean;
  error?: string;
}>;

function NotificationRow({ index, label, control, disabled, error }: RowProps) {
  const id = useId();
  const enabled = useWatch({ control, name: `preferences.${index}.enabled` });
  const inactive = disabled || !enabled;

  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_4rem_6rem_5rem_11rem] sm:items-center sm:gap-6">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-medium text-foreground">
          {label}
        </p>
        {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
      </div>

      <Controller
        control={control}
        name={`preferences.${index}.enabled`}
        render={({ field }) => (
          <label className="flex items-center gap-2 text-sm text-foreground">
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-describedby={`${id}-label`}
            />
            <span className="sm:sr-only">Ativo</span>
          </label>
        )}
      />

      <div className={cn('flex gap-6 sm:contents', inactive && 'opacity-60')}>
        <Controller
          control={control}
          name={`preferences.${index}.channels.inApp`}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                disabled={inactive}
                aria-describedby={`${id}-label`}
              />
              <span className="sm:sr-only">No sistema</span>
            </label>
          )}
        />
        <Controller
          control={control}
          name={`preferences.${index}.channels.email`}
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
                disabled={inactive}
                aria-describedby={`${id}-label`}
              />
              <span className="sm:sr-only">E-mail</span>
            </label>
          )}
        />
      </div>

      <div className={cn(inactive && 'opacity-60')}>
        <Field label={`Frequência: ${label}`} className="[&>label]:sr-only">
          <Controller
            control={control}
            name={`preferences.${index}.frequency`}
            render={({ field }) => (
              <SelectField
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                options={FREQUENCY_OPTIONS}
                disabled={inactive}
              />
            )}
          />
        </Field>
      </div>
    </li>
  );
}

type Props = Readonly<{ preferences: NotificationPreference[]; editable: boolean }>;

export function NotificationsForm({ preferences, editable }: Props) {
  const { setNotifications } = useSettingsCache();
  const values = useMemo<FormValues>(() => ({ preferences }), [preferences]);
  const form = useForm<FormValues>({ values });
  const { readOnly, isSaving } = useSectionSave({
    id: 'notifications',
    form,
    editable,
    toPayload,
    mutationFn: companySettingsService.updateNotifications,
    onSaved: setNotifications,
  });
  const disabled = readOnly || isSaving;
  const { errors } = form.formState;

  return (
    <SettingsCard
      title="Alertas e notificações"
      description="Escolha quais alertas a equipe recebe e por qual canal."
    >
      {errors.preferences?.message || errors.preferences?.root?.message ? (
        <p role="alert" className="mb-3 text-sm text-destructive">
          {errors.preferences?.message ?? errors.preferences?.root?.message}
        </p>
      ) : null}

      <div
        aria-hidden="true"
        className="hidden border-b border-border pb-2 text-xs font-medium text-muted-foreground sm:grid sm:grid-cols-[minmax(0,1fr)_4rem_6rem_5rem_11rem] sm:gap-6"
      >
        <span>Categoria</span>
        <span>Ativo</span>
        <span>No sistema</span>
        <span>E-mail</span>
        <span>Frequência</span>
      </div>

      <ul className="divide-y divide-border">
        {preferences.map((pref, index) => (
          <NotificationRow
            key={pref.category}
            index={index}
            label={pref.label}
            control={form.control}
            disabled={disabled}
            error={
              errors.preferences?.[index]?.frequency?.message ??
              errors.preferences?.[index]?.category?.message
            }
          />
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Por enquanto, as preferências são registradas e servirão de base para os alertas. Novos
        canais (SMS, WhatsApp) entrarão aqui quando houver integração.
      </p>
    </SettingsCard>
  );
}
