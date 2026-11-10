'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { maskPhone } from '@/shared/utils/phoneMask';
import { formatDateWith, toFormatSettings } from '@/shared/utils/companyFormat';
import {
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  LOCALE_OPTIONS,
  UF_OPTIONS,
} from '../../constants/options';
import { useSectionSave } from '../../hooks/useSectionSave';
import { type GeneralFormValues, generalSchema } from '../../schemas';
import { companySettingsService } from '../../services/companySettingsService';
import type { CompanySettings, DateFormat } from '../../types';
import { maskCep, maskCnpj } from '../../utils/document';
import { toGeneralFormValues, toGeneralPayload } from '../../utils/mappers';
import { Field, SelectField, TextField, useFieldContext } from '../fields';
import { ReadOnlyNotice } from '../ReadOnlyNotice';
import { SettingsCard } from '../SettingsCard';
import { TimezoneCombobox } from './TimezoneCombobox';

type Props = Readonly<{
  settings: CompanySettings;
  editable: boolean;
  onSaved: (settings: CompanySettings) => void;
}>;

const UF_SELECT_OPTIONS = UF_OPTIONS.map((uf) => ({ value: uf, label: uf }));
const CNPJ_DUPLICATE = { field: 'cnpj' as const, match: /CNPJ/i };

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/** Exemplo com a data de hoje ao lado de cada formato. */
function dateFormatOptions() {
  const today = todayIso();
  const base = toFormatSettings(undefined);
  return DATE_FORMAT_OPTIONS.map((o) => ({
    value: o.value,
    label: `${o.label} (${formatDateWith({ ...base, dateFormat: o.value as DateFormat }, today)})`,
  }));
}

function TimezoneControl(
  props: Readonly<{ value: string; onChange: (v: string) => void; disabled: boolean }>,
) {
  const { id, describedBy, invalid } = useFieldContext();
  return <TimezoneCombobox id={id} describedBy={describedBy} invalid={invalid} {...props} />;
}

export function OrganizationForm({ settings, editable, onSaved }: Props) {
  // Recalcula só quando a seção muda de fato (salvar unidades não descarta edições daqui).
  const generalKey = JSON.stringify(settings.general);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const values = useMemo(() => toGeneralFormValues(settings.general), [generalKey]);
  const dateOptions = useMemo(dateFormatOptions, []);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalSchema),
    values,
    mode: 'onTouched',
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { readOnly, submit, isSaving } = useSectionSave({
    id: 'general',
    form,
    editable,
    toPayload: toGeneralPayload,
    mutationFn: companySettingsService.updateGeneral,
    onSaved,
    businessField: CNPJ_DUPLICATE,
  });

  const disabled = readOnly || isSaving;
  const cnpj = register('cnpj');
  const phone = register('phone');
  const zipCode = register('address.zipCode');

  return (
    <SettingsCard
      title="Dados da organização"
      description="Informações que aparecem em relatórios e documentos."
      aside={readOnly ? <ReadOnlyNotice /> : null}
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-6"
      >
        <fieldset disabled={disabled} className="grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">Identificação</legend>
          <Field label="Nome fantasia" error={errors.name?.message} className="sm:col-span-2">
            <TextField {...register('name')} autoComplete="organization" />
          </Field>
          <Field label="CNPJ" error={errors.cnpj?.message}>
            <TextField
              {...cnpj}
              inputMode="numeric"
              autoComplete="off"
              placeholder="00.000.000/0000-00…"
              onChange={(event) => {
                event.target.value = maskCnpj(event.target.value);
                void cnpj.onChange(event);
              }}
            />
          </Field>
          <Field label="E-mail de contato" error={errors.email?.message}>
            <TextField
              {...register('email')}
              type="email"
              autoComplete="email"
              spellCheck={false}
              placeholder="contato@empresa.com.br…"
            />
          </Field>
          <Field label="Telefone" error={errors.phone?.message} hint="Opcional.">
            <TextField
              {...phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(85) 98888-7777…"
              onChange={(event) => {
                event.target.value = maskPhone(event.target.value);
                void phone.onChange(event);
              }}
            />
          </Field>
          <Field label="Fuso horário" error={errors.timezone?.message}>
            <Controller
              control={control}
              name="timezone"
              render={({ field }) => (
                <TimezoneControl
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
          </Field>
          <Field label="Moeda padrão" error={errors.currency?.message}>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={CURRENCY_OPTIONS}
                  disabled={disabled}
                />
              )}
            />
          </Field>
          <Field label="Idioma" error={errors.locale?.message}>
            <Controller
              control={control}
              name="locale"
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={LOCALE_OPTIONS}
                  disabled={disabled}
                />
              )}
            />
          </Field>
          <Field label="Formato de data" error={errors.dateFormat?.message}>
            <Controller
              control={control}
              name="dateFormat"
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={dateOptions}
                  disabled={disabled}
                />
              )}
            />
          </Field>
        </fieldset>

        <fieldset disabled={disabled} className="grid gap-4 sm:grid-cols-6">
          <legend className="mb-3 text-sm font-semibold text-foreground">Endereço</legend>
          <Field label="CEP" error={errors.address?.zipCode?.message} className="sm:col-span-2">
            <TextField
              {...zipCode}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000…"
              onChange={(event) => {
                event.target.value = maskCep(event.target.value);
                void zipCode.onChange(event);
              }}
            />
          </Field>
          <Field
            label="Logradouro"
            error={errors.address?.street?.message}
            className="sm:col-span-4"
          >
            <TextField {...register('address.street')} autoComplete="address-line1" />
          </Field>
          <Field label="Número" error={errors.address?.number?.message} className="sm:col-span-2">
            <TextField {...register('address.number')} autoComplete="off" />
          </Field>
          <Field
            label="Complemento"
            error={errors.address?.complement?.message}
            hint="Opcional."
            className="sm:col-span-4"
          >
            <TextField {...register('address.complement')} autoComplete="address-line2" />
          </Field>
          <Field
            label="Bairro"
            error={errors.address?.neighborhood?.message}
            className="sm:col-span-2"
          >
            <TextField {...register('address.neighborhood')} autoComplete="address-level3" />
          </Field>
          <Field label="Cidade" error={errors.address?.city?.message} className="sm:col-span-3">
            <TextField {...register('address.city')} autoComplete="address-level2" />
          </Field>
          <Field label="UF" error={errors.address?.state?.message} className="sm:col-span-1">
            <Controller
              control={control}
              name="address.state"
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={UF_SELECT_OPTIONS}
                  placeholder="UF"
                  disabled={disabled}
                />
              )}
            />
          </Field>
        </fieldset>
      </form>
    </SettingsCard>
  );
}
