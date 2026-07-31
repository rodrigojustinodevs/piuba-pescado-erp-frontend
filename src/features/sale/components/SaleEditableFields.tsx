'use client';

import type { UseFormRegisterReturn } from 'react-hook-form';
import { Select, TextArea, type SelectOption } from '@/shared/components/form';
import { Input } from '@/shared/components/ui';

type SaleEditableFieldsProps = {
  isSubmitting: boolean;
  statusOptions: SelectOption[];
  pricePerKgMin: number;
  pricePerKgRegister: UseFormRegisterReturn;
  saleDateRegister: UseFormRegisterReturn;
  statusRegister: UseFormRegisterReturn;
  notesRegister: UseFormRegisterReturn;
  pricePerKgError?: string;
  saleDateError?: string;
  statusError?: string;
  notesError?: string;
};

export function SaleEditableFields({
  isSubmitting,
  statusOptions,
  pricePerKgMin,
  pricePerKgRegister,
  saleDateRegister,
  statusRegister,
  notesRegister,
  pricePerKgError,
  saleDateError,
  statusError,
  notesError,
}: Readonly<SaleEditableFieldsProps>) {
  return (
    <>
      <Input
        label="Preço por kg"
        requiredIndicator
        type="number"
        step={0.01}
        min={pricePerKgMin}
        disabled={isSubmitting}
        {...pricePerKgRegister}
        error={pricePerKgError}
      />

      <Input
        label="Data da venda"
        requiredIndicator
        type="date"
        disabled={isSubmitting}
        {...saleDateRegister}
        error={saleDateError}
      />

      <Select
        label="Status"
        required
        disabled={isSubmitting}
        options={statusOptions}
        {...statusRegister}
        error={statusError}
      />

      <div className="md:col-span-2 w-full min-w-0">
        <TextArea
          label="Observações"
          disabled={isSubmitting}
          placeholder="Observações da venda"
          rows={4}
          className="w-full"
          inputClassName="w-full min-h-[100px]"
          {...notesRegister}
          error={notesError}
        />
      </div>
    </>
  );
}

