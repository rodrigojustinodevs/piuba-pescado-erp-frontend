'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { Control } from 'react-hook-form';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/features/company';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { FormActions } from '@/shared/components/form';
import { Input, Select } from '@/shared/components/ui';
import type { CreatePurchaseData } from '../types';
import { createPurchaseFormSchema, type CreatePurchaseFormData } from '../schemas';
import { usePurchaseSuppliers } from '../hooks/usePurchaseSuppliers';
import { usePurchaseSupplies } from '../hooks/usePurchaseSupplies';
import { getPurchaseStatusLabel } from '../utils/purchaseStatusLabels';
import { formatPurchaseMoney } from '../utils/formatPurchaseMoney';
import { z } from 'zod';

const STATUS_OPTIONS = [
  { value: 'draft', label: getPurchaseStatusLabel('draft') },
  { value: 'confirmed', label: getPurchaseStatusLabel('confirmed') },
  { value: 'received', label: getPurchaseStatusLabel('received') },
  { value: 'cancelled', label: getPurchaseStatusLabel('cancelled') },
];

function todayISODate(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

type PurchaseFormProps = {
  initialValues?: CreatePurchaseFormData;
  onSubmit: (data: CreatePurchaseData) => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  statusOptions?: Array<CreatePurchaseFormData['status']>;
};

function ItemLineTotals({
  control,
  index,
}: {
  control: Control<CreatePurchaseFormData>;
  index: number;
}) {
  const qty = useWatch({ control, name: `items.${index}.quantity` });
  const price = useWatch({ control, name: `items.${index}.unitPrice` });
  const total = roundMoney((Number(qty) || 0) * (Number(price) || 0));
  return (
    <p className="text-sm text-slate-600 pt-7">
      Subtotal:{' '}
      <span className="font-medium text-[#0F172A] tabular-nums">{formatPurchaseMoney(total)}</span>
    </p>
  );
}

export function PurchaseForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  statusOptions,
}: Readonly<PurchaseFormProps>) {
  const { user, isMaster } = useAuthContext();
  const showCompanySelect = isMaster();

  const resolverSchema = useMemo(
    () =>
      createPurchaseFormSchema.superRefine((data, ctx) => {
        if (showCompanySelect && !data.companyId?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Selecione a empresa',
            path: ['companyId'],
          });
        }
      }),
    [showCompanySelect],
  );

  const availableStatusOptions = useMemo(() => {
    const allowed = new Set(statusOptions ?? STATUS_OPTIONS.map((option) => option.value));
    return STATUS_OPTIONS.filter((option) => allowed.has(option.value));
  }, [statusOptions]);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreatePurchaseFormData>({
    resolver: zodResolver(resolverSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialValues ?? {
      companyId: '',
      supplierId: '',
      invoiceNumber: '',
      purchaseDate: todayISODate(),
      status: 'draft',
      items: [{ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0 }],
    },
  });

  const selectedCompanyId = useWatch({ control, name: 'companyId' });
  const effectiveCompanyId =
    (showCompanySelect ? selectedCompanyId : user?.companyId)?.trim() || '';

  const { data: companiesData, isLoading: loadingCompanies } = useCompanies({
    page: 1,
    limit: 500,
    enabled: showCompanySelect,
  });
  const companyOptions = useMemo(
    () => (companiesData?.companies ?? []).map((c) => ({ value: c.id, label: c.name })),
    [companiesData?.companies],
  );

  const { data: suppliersData, isLoading: loadingSuppliers } = usePurchaseSuppliers(
    !!effectiveCompanyId,
    effectiveCompanyId,
  );
  const { data: suppliesData, isLoading: loadingSupplies } = usePurchaseSupplies(
    !!effectiveCompanyId,
    effectiveCompanyId,
  );

  const supplierOptions = useMemo(
    () => (suppliersData?.suppliers ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliersData?.suppliers],
  );
  const supplyOptions = useMemo(
    () => (suppliesData?.supplies ?? []).map((s) => ({ value: s.id, label: s.name })),
    [suppliesData?.supplies],
  );

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const prevCompanyForReset = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = effectiveCompanyId || undefined;
    if (!id) return;
    if (prevCompanyForReset.current !== undefined && prevCompanyForReset.current !== id) {
      setValue('supplierId', '');
      setValue('items', [{ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0 }]);
    }
    prevCompanyForReset.current = id;
  }, [effectiveCompanyId, setValue]);

  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700">
        Carregando sessão...
      </div>
    );
  }

  if (!showCompanySelect && !user.companyId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
        Não foi possível identificar a empresa do usuário. Faça login novamente ou contate o
        suporte.
      </div>
    );
  }

  const submit = (form: CreatePurchaseFormData) => {
    const companyId = showCompanySelect ? form.companyId?.trim() : user.companyId;
    if (!companyId) return;
    const inv = form.invoiceNumber?.trim();
    onSubmit({
      companyId,
      supplierId: form.supplierId,
      invoiceNumber: inv ? inv : null,
      purchaseDate: form.purchaseDate,
      status: form.status,
      items: form.items.map((it) => ({
        supplyId: it.supplyId,
        quantity: it.quantity,
        unit: it.unit.trim(),
        unitPrice: it.unitPrice,
        totalPrice: roundMoney(it.quantity * it.unitPrice),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">Dados da compra</h2>
          <p className="mt-1 text-sm text-slate-600">Fornecedor, documento, data e status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showCompanySelect ? (
            <div className="md:col-span-2">
              <Select
                label="Empresa"
                requiredIndicator
                disabled={isSubmitting || loadingCompanies}
                options={companyOptions}
                placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
                {...register('companyId')}
                error={errors.companyId?.message}
              />
            </div>
          ) : null}

          <Select
            label="Fornecedor"
            requiredIndicator
            disabled={isSubmitting || !effectiveCompanyId || loadingSuppliers}
            options={supplierOptions}
            placeholder={
              !effectiveCompanyId
                ? showCompanySelect
                  ? 'Selecione a empresa primeiro'
                  : '—'
                : loadingSuppliers
                  ? 'Carregando...'
                  : 'Selecione o fornecedor'
            }
            {...register('supplierId')}
            error={errors.supplierId?.message}
          />

          <Input
            label="NF / Documento"
            type="text"
            disabled={isSubmitting}
            placeholder="Opcional"
            {...register('invoiceNumber')}
            error={errors.invoiceNumber?.message}
          />

          <Input
            label="Data da compra"
            requiredIndicator
            type="date"
            disabled={isSubmitting}
            {...register('purchaseDate')}
            error={errors.purchaseDate?.message}
          />

          <Select
            label="Status"
            requiredIndicator
            disabled={isSubmitting}
            options={availableStatusOptions}
            {...register('status')}
            error={errors.status?.message}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">Itens</h2>
              <p className="mt-1 text-sm text-slate-600">
                Insumos, quantidades e preços unitários.
              </p>
            </div>
            <button
              type="button"
              disabled={isSubmitting || !effectiveCompanyId}
              onClick={() => append({ supplyId: '', quantity: 1, unit: 'kg', unitPrice: 0 })}
              className="text-sm font-medium text-[#0EA5A4] hover:text-[#0F766E] disabled:opacity-50"
            >
              + Adicionar item
            </button>
          </div>

          {errors.items && 'message' in errors.items && errors.items.message ? (
            <p className="text-sm text-red-600 mb-2">{errors.items.message}</p>
          ) : null}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-200 p-4 md:p-6 bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-sm font-medium text-slate-700">Item {index + 1}</span>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => remove(index)}
                      className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      Remover
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
                  <div className="lg:col-span-4">
                    <Controller
                      name={`items.${index}.supplyId`}
                      control={control}
                      render={({ field: f }) => (
                        <Select
                          label="Insumo"
                          requiredIndicator
                          disabled={isSubmitting || !effectiveCompanyId || loadingSupplies}
                          options={supplyOptions}
                          placeholder={
                            !effectiveCompanyId
                              ? showCompanySelect
                                ? 'Selecione a empresa primeiro'
                                : '—'
                              : loadingSupplies
                                ? 'Carregando...'
                                : 'Selecione o insumo'
                          }
                          name={f.name}
                          value={f.value}
                          onBlur={f.onBlur}
                          onChange={(e) => {
                            f.onChange(e);
                            const id = e.target.value;
                            const row = suppliesData?.supplies?.find((s) => s.id === id);
                            if (row) setValue(`items.${index}.unit`, row.unit);
                          }}
                          ref={f.ref}
                          error={errors.items?.[index]?.supplyId?.message}
                        />
                      )}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Input
                      label="Quantidade"
                      requiredIndicator
                      type="number"
                      step="any"
                      min={0}
                      disabled={isSubmitting}
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                      error={errors.items?.[index]?.quantity?.message}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Input
                      label="Unidade"
                      requiredIndicator
                      type="text"
                      disabled={isSubmitting}
                      placeholder="kg, unit..."
                      {...register(`items.${index}.unit`)}
                      error={errors.items?.[index]?.unit?.message}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Input
                      label="Preço unitário"
                      requiredIndicator
                      type="number"
                      step="any"
                      min={0}
                      disabled={isSubmitting}
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                      error={errors.items?.[index]?.unitPrice?.message}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <ItemLineTotals control={control} index={index} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <FormActions
            submitLabel={submitLabel}
            loadingLabel={submittingLabel}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
}
