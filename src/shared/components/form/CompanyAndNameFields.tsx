'use client';

import type { InputProps } from '@/shared/components/ui/Input';
import type { SelectProps } from './types';
import { Input } from '@/shared/components/ui';
import { Select } from './Select';

type CompanyAndNameFieldsProps = {
  showCompanySelect: boolean;
  isSubmitting: boolean;
  loadingCompanies: boolean;
  companyOptions: SelectProps['options'];
  companySelectProps: Omit<SelectProps, 'label' | 'required' | 'disabled' | 'options' | 'placeholder' | 'error'>;
  companyError?: string;
  nameInputProps: Omit<InputProps, 'label' | 'requiredIndicator' | 'type' | 'disabled' | 'error'>;
  nameError?: string;
};

export function CompanyAndNameFields({
  showCompanySelect,
  isSubmitting,
  loadingCompanies,
  companyOptions,
  companySelectProps,
  companyError,
  nameInputProps,
  nameError,
}: Readonly<CompanyAndNameFieldsProps>) {
  return (
    <>
      {showCompanySelect ? (
        <div className="md:col-span-2">
          <Select
            label="Empresa"
            required
            disabled={isSubmitting || loadingCompanies}
            options={companyOptions}
            placeholder={loadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'}
            error={companyError}
            {...companySelectProps}
          />
        </div>
      ) : null}

      <Input
        label="Nome"
        requiredIndicator
        type="text"
        disabled={isSubmitting}
        error={nameError}
        {...nameInputProps}
      />
    </>
  );
}

