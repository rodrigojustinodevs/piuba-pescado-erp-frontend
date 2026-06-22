import { useMemo } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { usePurchaseSuppliers } from './usePurchaseSuppliers';
import { usePurchaseSupplies } from './usePurchaseSupplies';

type UsePurchaseLookupOptionsParams<T extends FieldValues> = {
  control: Control<T>;
  showCompanySelect: boolean;
  companyIdFieldName?: Path<T>;
};

export function usePurchaseLookupOptions<T extends FieldValues>({
  control,
  showCompanySelect,
  companyIdFieldName = 'companyId' as Path<T>,
}: UsePurchaseLookupOptionsParams<T>) {
  const { user } = useAuthContext();
  const selectedCompanyId = useWatch({ control, name: companyIdFieldName });
  const effectiveCompanyId = (showCompanySelect ? selectedCompanyId : user?.companyId)?.trim() || '';

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

  return {
    effectiveCompanyId,
    suppliersData,
    loadingSuppliers,
    supplierOptions,
    suppliesData,
    loadingSupplies,
    supplyOptions,
  };
}

