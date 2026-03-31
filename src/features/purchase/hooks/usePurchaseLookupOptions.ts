import { useMemo } from 'react';
import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { usePurchaseSuppliers } from './usePurchaseSuppliers';
import { usePurchaseSupplies } from './usePurchaseSupplies';

type UsePurchaseLookupOptionsParams = {
  control: Control<any>;
  showCompanySelect: boolean;
  companyIdFieldName?: string;
};

export function usePurchaseLookupOptions({
  control,
  showCompanySelect,
  companyIdFieldName = 'companyId',
}: UsePurchaseLookupOptionsParams) {
  const { user } = useAuthContext();
  const selectedCompanyId = useWatch({ control, name: companyIdFieldName as any });
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

