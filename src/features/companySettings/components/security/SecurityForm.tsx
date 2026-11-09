'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { z } from 'zod';
import { Switch } from '@/shared/components/ui/Switch';
import { useSettingsCache } from '../../hooks/queries';
import { useSectionSave } from '../../hooks/useSectionSave';
import { companySettingsService } from '../../services/companySettingsService';
import type { SecurityPayload, SecuritySettings } from '../../types';
import { Field, SelectField, TextField } from '../fields';
import { SettingsCard } from '../SettingsCard';

const DEFAULT_TTL = 'default';

type FormValues = {
  sessionTtl: string;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSymbol: boolean;
  };
};

function buildSchema(limits: SecuritySettings['passwordPolicy']['limits']) {
  return z.object({
    sessionTtl: z.string(),
    passwordPolicy: z.object({
      minLength: z
        .number({ error: 'Informe um número.' })
        .int('Use um número inteiro.')
        .min(limits.min, `Mínimo de ${limits.min} caracteres.`)
        .max(limits.max, `Máximo de ${limits.max} caracteres.`),
      requireUppercase: z.boolean(),
      requireNumber: z.boolean(),
      requireSymbol: z.boolean(),
    }),
  });
}

/** Opções de TTL lidas da API (nada fixo no código), de 5 em 5 minutos. */
function ttlOptions(security: SecuritySettings) {
  const { min, max, default: fallback } = security.sessionTtlLimits;
  const values = new Set<number>();
  for (let v = min; v <= max; v += 5) values.add(v);
  values.add(max);
  if (security.sessionTtlMinutes !== null) values.add(security.sessionTtlMinutes);
  return [
    { value: DEFAULT_TTL, label: `Padrão do sistema (${fallback} min)` },
    ...[...values].sort((a, b) => a - b).map((v) => ({ value: String(v), label: `${v} minutos` })),
  ];
}

function toPayload(values: FormValues): SecurityPayload {
  return {
    sessionTtlMinutes: values.sessionTtl === DEFAULT_TTL ? null : Number(values.sessionTtl),
    passwordPolicy: { ...values.passwordPolicy },
  };
}

const RULES = [
  { name: 'requireUppercase', label: 'Exigir letra maiúscula' },
  { name: 'requireNumber', label: 'Exigir número' },
  { name: 'requireSymbol', label: 'Exigir símbolo' },
] as const;

function RuleSwitch({
  control,
  name,
  label,
  disabled,
}: Readonly<{
  control: Control<FormValues>;
  name: (typeof RULES)[number]['name'];
  label: string;
  disabled: boolean;
}>) {
  return (
    <Controller
      control={control}
      name={`passwordPolicy.${name}`}
      render={({ field }) => (
        <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3 text-sm text-foreground">
          {label}
          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
        </label>
      )}
    />
  );
}

type Props = Readonly<{ security: SecuritySettings; editable: boolean }>;

export function SecurityForm({ security, editable }: Props) {
  const { setSecurity } = useSettingsCache();
  const { limits } = security.passwordPolicy;
  const schema = useMemo(() => buildSchema(limits), [limits]);
  const options = useMemo(() => ttlOptions(security), [security]);
  const values = useMemo<FormValues>(
    () => ({
      sessionTtl:
        security.sessionTtlMinutes === null ? DEFAULT_TTL : String(security.sessionTtlMinutes),
      passwordPolicy: {
        minLength: security.passwordPolicy.minLength,
        requireUppercase: security.passwordPolicy.requireUppercase,
        requireNumber: security.passwordPolicy.requireNumber,
        requireSymbol: security.passwordPolicy.requireSymbol,
      },
    }),
    [security],
  );

  const form = useForm<FormValues>({ resolver: zodResolver(schema), values });
  const { readOnly, isSaving } = useSectionSave({
    id: 'security',
    form,
    editable,
    toPayload,
    mutationFn: companySettingsService.updateSecurity,
    onSaved: setSecurity,
  });
  const disabled = readOnly || isSaving;
  const { errors } = form.formState;

  return (
    <div className="flex flex-col gap-6">
      <SettingsCard title="Sessão" description="Tempo até o usuário precisar entrar novamente.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Expiração da sessão"
            error={errors.sessionTtl?.message}
            hint={`Em vigor: ${security.effectiveSessionTtlMinutes} minutos.`}
          >
            <Controller
              control={form.control}
              name="sessionTtl"
              render={({ field }) => (
                <SelectField
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  options={options}
                  disabled={disabled}
                />
              )}
            />
          </Field>
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />A empresa só pode encurtar
          a sessão. A alteração vale para os próximos logins e renovações; sessões já abertas mantêm
          a expiração atual.
        </p>
      </SettingsCard>

      <SettingsCard
        title="Política de senha"
        description="Aplicada ao definir ou alterar a senha de um usuário da empresa."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Tamanho mínimo"
            error={errors.passwordPolicy?.minLength?.message}
            hint={`Entre ${limits.min} e ${limits.max} caracteres.`}
          >
            <TextField
              type="number"
              inputMode="numeric"
              autoComplete="off"
              min={limits.min}
              max={limits.max}
              disabled={disabled}
              {...form.register('passwordPolicy.minLength', { valueAsNumber: true })}
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {RULES.map((rule) => (
            <RuleSwitch key={rule.name} control={form.control} disabled={disabled} {...rule} />
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
