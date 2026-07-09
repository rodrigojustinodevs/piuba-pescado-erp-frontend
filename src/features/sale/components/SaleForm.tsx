'use client';

import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm, useWatch, type Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useClients } from '@/features/client';
import { useBatches } from '@/features/batch';
import { useStockings } from '@/features/stocking';
import { useFinancialCategories } from '@/features/financialCategory';
import { useQueryClient } from '@tanstack/react-query';
import type { AuthState } from '@/shared/types/auth';
import { FormActions } from '@/shared/components/form';
import type { CreateSaleData } from '../types';
import { createSaleFormSchema, type CreateSaleFormData } from '../schemas';

type SaleFormProps = {
  initialValues?: CreateSaleFormData;
  onSubmit: (data: CreateSaleData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  inDialog?: boolean;
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'paid', label: 'Paga' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'overdue', label: 'Atrasada' },
  { value: 'cancelled', label: 'Cancelada' },
];

const PAYMENT_OPTIONS = [
  { value: '', label: '— Nenhum —' },
  { value: 'pix', label: 'PIX' },
  { value: 'bank_slip', label: 'Boleto bancário' },
  { value: 'bank_transfer', label: 'Transferência bancária' },
  { value: 'credit_card', label: 'Cartão de crédito' },
  { value: 'debit_card', label: 'Cartão de débito' },
  { value: 'cash', label: 'Dinheiro' },
  { value: 'check', label: 'Cheque' },
];

function formatMoney(value: number): string {
  if (!Number.isFinite(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const DEFAULT_ITEM = {
  batchId: '',
  stockingId: '',
  totalWeight: 0,
  pricePerKg: 0,
  isTotalHarvest: false,
  category: '',
  notes: '',
};

const DEFAULT_VALUES: CreateSaleFormData = {
  clientId: '',
  financialCategoryId: '',
  needsInvoice: false,
  invoiceNumber: '',
  status: 'pending',
  paymentMethod: '',
  saleDate: '',
  dueDate: '',
  items: [{ ...DEFAULT_ITEM }],
  discount: 0,
  shipping: 0,
  taxes: 0,
  notes: '',
};

export function SaleForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  inDialog = false,
}: Readonly<SaleFormProps>) {
  const queryClient = useQueryClient();
  const authState = queryClient.getQueryData<AuthState>(['auth', 'check']);
  const currentUserId = authState?.user?.id ?? null;
  const { data: clientsData, isLoading: isLoadingClients } = useClients({ page: 1, limit: 1000 });
  const { batches, isLoading: isLoadingBatches } = useBatches({ page: 1, limit: 1000 });
  const { data: financialCategoriesData, isLoading: isLoadingCategories } = useFinancialCategories({
    limit: 1000,
  });

  const clientOptions = useMemo(
    () => (clientsData?.clients ?? []).map((c) => ({ value: c.id, label: c.name })),
    [clientsData?.clients],
  );

  const batchOptions = useMemo(
    () => [
      { value: '', label: '— Nenhum —' },
      ...batches.map((b) => ({ value: b.id, label: b.name || b.id })),
    ],
    [batches],
  );

  const financialCategoryOptions = useMemo(
    () =>
      (financialCategoriesData?.financialCategories ?? []).map((fc) => ({
        value: fc.id,
        label: fc.name,
      })),
    [financialCategoriesData],
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSaleFormData>({
    resolver: zodResolver(createSaleFormSchema),
    mode: 'onChange',
    defaultValues: initialValues ?? DEFAULT_VALUES,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const needsInvoiceWatch = useWatch({ control, name: 'needsInvoice' });
  const watchedItems = useWatch({ control, name: 'items' }) ?? [];
  const watchedDiscount = useWatch({ control, name: 'discount' }) ?? 0;
  const watchedShipping = useWatch({ control, name: 'shipping' }) ?? 0;
  const watchedTaxes = useWatch({ control, name: 'taxes' }) ?? 0;

  const subtotal = watchedItems.reduce((sum, item) => {
    const tw = Number(item?.totalWeight) || 0;
    const price = Number(item?.pricePerKg) || 0;
    return sum + tw * price;
  }, 0);
  const total =
    subtotal -
    (Number(watchedDiscount) || 0) +
    (Number(watchedShipping) || 0) +
    (Number(watchedTaxes) || 0);

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';
  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#0EA5A4] focus:outline-none focus:ring-1 focus:ring-[#0EA5A4] disabled:opacity-50';
  const selectClass = inputClass;
  const errorClass = 'mt-1 text-xs text-red-500';

  const fields_content = (
    <div className="space-y-5">
      {/* Row 1: Cliente + Categoria financeira */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="clientId">
            Cliente <span className="text-red-500">*</span>
          </label>
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="clientId"
                value={field.value ?? ''}
                className={selectClass}
                disabled={isSubmitting || isLoadingClients}
              >
                <option value="">{isLoadingClients ? 'Carregando...' : 'Selecione'}</option>
                {clientOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.clientId && <p className={errorClass}>{errors.clientId.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="financialCategoryId">
            Categoria financeira
          </label>
          <Controller
            name="financialCategoryId"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="financialCategoryId"
                value={field.value ?? ''}
                className={selectClass}
                disabled={isSubmitting || isLoadingCategories}
              >
                <option value="">{isLoadingCategories ? 'Carregando...' : '— Nenhuma —'}</option>
                {financialCategoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>

      {/* Nota Fiscal: toggle + campo condicional */}
      <div className="flex flex-wrap items-center gap-4">
        <span className={labelClass + ' mb-0'}>Emitir nota fiscal?</span>
        <button
          type="button"
          role="switch"
          aria-checked={!!needsInvoiceWatch}
          disabled={isSubmitting}
          onClick={() => setValue('needsInvoice', !needsInvoiceWatch)}
          className={[
            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4] focus-visible:ring-offset-2 disabled:opacity-50',
            needsInvoiceWatch ? 'bg-[#0EA5A4]' : 'bg-slate-300',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out',
              needsInvoiceWatch ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
        {needsInvoiceWatch && (
          <input
            type="text"
            aria-label="Número da nota fiscal"
            placeholder="NF-2026/000"
            className={inputClass + ' max-w-48'}
            disabled={isSubmitting}
            {...register('invoiceNumber')}
          />
        )}
      </div>

      {/* Row 2: Status + Forma de pagamento */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className={selectClass}
            disabled={isSubmitting}
            {...register('status')}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="paymentMethod">
            Forma de pagamento
          </label>
          <select
            id="paymentMethod"
            className={selectClass}
            disabled={isSubmitting}
            {...register('paymentMethod')}
          >
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3: Data da venda + Vencimento */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="saleDate">
            Data da venda <span className="text-red-500">*</span>
          </label>
          <input
            id="saleDate"
            type="date"
            className={inputClass}
            disabled={isSubmitting}
            {...register('saleDate')}
          />
          {errors.saleDate && <p className={errorClass}>{errors.saleDate.message}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="dueDate">
            Vencimento
          </label>
          <input
            id="dueDate"
            type="date"
            className={inputClass}
            disabled={isSubmitting}
            {...register('dueDate')}
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={labelClass + ' mb-0'}>
            Itens <span className="text-red-500">*</span>
          </span>
          <button
            type="button"
            onClick={() => append({ ...DEFAULT_ITEM })}
            disabled={isSubmitting}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const tw = Number(watchedItems[index]?.totalWeight) || 0;
            const price = Number(watchedItems[index]?.pricePerKg) || 0;
            const lineTotal = tw * price;
            const isTotalHarvest = watchedItems[index]?.isTotalHarvest ?? false;
            const batchIdForItem = watchedItems[index]?.batchId ?? '';
            const stockingIdForItem = watchedItems[index]?.stockingId ?? '';

            return (
              <ItemRow
                key={field.id}
                index={index}
                lineTotal={lineTotal}
                isTotalHarvest={isTotalHarvest}
                batchIdForItem={batchIdForItem}
                stockingIdForItem={stockingIdForItem}
                isSubmitting={isSubmitting}
                canRemove={fields.length > 1}
                batchOptions={batchOptions}
                isLoadingBatches={isLoadingBatches}
                control={control}
                register={register}
                setValue={setValue}
                remove={remove}
                inputClass={inputClass}
                selectClass={selectClass}
                errorClass={errorClass}
                labelClass={labelClass}
              />
            );
          })}
        </div>
        {errors.items && !Array.isArray(errors.items) && (
          <p className={errorClass}>{errors.items.message}</p>
        )}
      </div>

      {/* Row: Desconto + Frete + Impostos */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="discount">
            Desconto (R$)
          </label>
          <input
            id="discount"
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            disabled={isSubmitting}
            {...register('discount', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="shipping">
            Frete (R$)
          </label>
          <input
            id="shipping"
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            disabled={isSubmitting}
            {...register('shipping', { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="taxes">
            Impostos (R$)
          </label>
          <input
            id="taxes"
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            disabled={isSubmitting}
            {...register('taxes', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-slate-50 px-4 py-3 space-y-1.5 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span className="tabular-nums">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Desconto</span>
          <span className="tabular-nums text-red-500">
            - {formatMoney(Number(watchedDiscount) || 0)}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Frete</span>
          <span className="tabular-nums">+ {formatMoney(Number(watchedShipping) || 0)}</span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Impostos</span>
          <span className="tabular-nums">+ {formatMoney(Number(watchedTaxes) || 0)}</span>
        </div>
        <div className="flex justify-between font-semibold text-slate-800 pt-1 border-t border-slate-200">
          <span>Total</span>
          <span className="tabular-nums">{formatMoney(total)}</span>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className={labelClass} htmlFor="notes">
          Observações
        </label>
        <textarea
          id="notes"
          rows={3}
          className={`${inputClass} resize-none`}
          disabled={isSubmitting}
          {...register('notes')}
        />
      </div>

      <FormActions
        submitLabel={submitLabel}
        loadingLabel={submittingLabel}
        isLoading={isSubmitting}
        onCancel={onCancel}
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit({
          clientId: data.clientId,
          saleDate: data.saleDate,
          financialCategoryId: data.financialCategoryId?.trim() || null,
          responsibleUserId: currentUserId,
          dueDate: data.dueDate?.trim() || null,
          status: data.status,
          notes: data.notes?.trim() || null,
          needsInvoice: data.needsInvoice,
          invoiceNumber: data.needsInvoice ? (data.invoiceNumber?.trim() || null) : null,
          discount: data.discount,
          shipping: data.shipping,
          taxes: data.taxes,
          paymentMethod: data.paymentMethod?.trim() || null,
          items: data.items.map((item) => ({
            batchId: item.batchId?.trim() || null,
            stockingId: item.stockingId?.trim() || null,
            totalWeight: Number(item.totalWeight) || 0,
            pricePerKg: Number(item.pricePerKg) || 0,
            isTotalHarvest: item.isTotalHarvest,
            category: item.category?.trim() || null,
            notes: item.notes?.trim() || null,
          })),
        });
      })}
    >
      {inDialog ? (
        fields_content
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {fields_content}
        </div>
      )}
    </form>
  );
}

type ItemRowProps = {
  index: number;
  lineTotal: number;
  isTotalHarvest: boolean;
  batchIdForItem: string;
  stockingIdForItem: string;
  isSubmitting: boolean;
  canRemove: boolean;
  batchOptions: { value: string; label: string }[];
  isLoadingBatches: boolean;
  control: Control<CreateSaleFormData>;
  register: ReturnType<typeof useForm<CreateSaleFormData>>['register'];
  setValue: ReturnType<typeof useForm<CreateSaleFormData>>['setValue'];
  remove: (index: number) => void;
  inputClass: string;
  selectClass: string;
  errorClass: string;
  labelClass: string;
};

function ItemRow({
  index,
  lineTotal,
  isTotalHarvest,
  batchIdForItem,
  stockingIdForItem,
  isSubmitting,
  canRemove,
  batchOptions,
  isLoadingBatches,
  control,
  register,
  setValue,
  remove,
  inputClass,
  selectClass,
  labelClass,
}: Readonly<ItemRowProps>) {
  const { data: stockingsData, isLoading: isLoadingStockings } = useStockings({
    batchId: batchIdForItem || undefined,
    enabled: !!batchIdForItem,
  });

  const stockingOptions = useMemo(
    () =>
      (stockingsData?.stockings ?? []).map((s) => ({
        value: s.id,
        label: s.stockingDate ? `Povoamento ${s.stockingDate}` : s.id,
        biomass: (s.quantity * s.averageWeight) / 1000,
      })),
    [stockingsData],
  );

  const selectedBiomass = useMemo(() => {
    const found = stockingOptions.find((s) => s.value === stockingIdForItem);
    return found?.biomass ?? null;
  }, [stockingOptions, stockingIdForItem]);

  return (
    <div className="rounded-lg border border-slate-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Item {index + 1}</span>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700 tabular-nums">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              lineTotal,
            )}
          </span>
          <button
            type="button"
            onClick={() => remove(index)}
            disabled={isSubmitting || !canRemove}
            className="flex items-center justify-center text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Lote + Povoamento */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor={`items.${index}.batchId`}>
            Lote
          </label>
          <Controller
            name={`items.${index}.batchId`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id={`items.${index}.batchId`}
                value={field.value ?? ''}
                className={selectClass}
                disabled={isSubmitting || isLoadingBatches}
                onChange={(e) => {
                  field.onChange(e);
                  setValue(`items.${index}.stockingId`, '');
                }}
              >
                {batchOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`items.${index}.stockingId`}>
            Povoamento
          </label>
          <Controller
            name={`items.${index}.stockingId`}
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id={`items.${index}.stockingId`}
                value={field.value ?? ''}
                className={selectClass}
                disabled={isSubmitting || isLoadingStockings || !batchIdForItem}
              >
                <option value="">
                  {isLoadingStockings ? 'Carregando...' : '— Selecione —'}
                </option>
                {stockingOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          />
          {selectedBiomass !== null && (
            <p className="mt-1 text-xs text-emerald-700">
              Biomassa disponível:{' '}
              <span className="font-medium">
                {selectedBiomass.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Peso + Preço/kg + Categoria */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor={`items.${index}.totalWeight`}>
            Peso total (kg)
          </label>
          <input
            id={`items.${index}.totalWeight`}
            type="number"
            min={0.001}
            step={0.001}
            className={inputClass}
            disabled={isSubmitting}
            {...register(`items.${index}.totalWeight`, { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`items.${index}.pricePerKg`}>
            Preço / kg (R$)
          </label>
          <input
            id={`items.${index}.pricePerKg`}
            type="number"
            min={0}
            step={0.01}
            className={inputClass}
            disabled={isSubmitting}
            {...register(`items.${index}.pricePerKg`, { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor={`items.${index}.category`}>
            Categoria
          </label>
          <input
            id={`items.${index}.category`}
            type="text"
            placeholder="Ex: G"
            className={inputClass}
            disabled={isSubmitting}
            {...register(`items.${index}.category`)}
          />
        </div>
      </div>

      {/* Colheita total + Observações */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-slate-700">Colheita total?</span>
        <button
          type="button"
          role="switch"
          aria-checked={isTotalHarvest}
          disabled={isSubmitting}
          onClick={() => setValue(`items.${index}.isTotalHarvest`, !isTotalHarvest)}
          className={[
            'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5A4] focus-visible:ring-offset-2 disabled:opacity-50',
            isTotalHarvest ? 'bg-[#0EA5A4]' : 'bg-slate-300',
          ].join(' ')}
        >
          <span
            className={[
              'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out',
              isTotalHarvest ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
        </button>
      </div>

      <div>
        <label className={labelClass} htmlFor={`items.${index}.notes`}>
          Observações do item
        </label>
        <input
          id={`items.${index}.notes`}
          type="text"
          placeholder="Observações..."
          className={inputClass}
          disabled={isSubmitting}
          {...register(`items.${index}.notes`)}
        />
      </div>
    </div>
  );
}
