import { useMemo } from 'react';
import { useCompanies } from '@/features/company';

type CompanyOption = { value: string; label: string };

export function useCompanyOptions(showCompanySelect: boolean) {
  const { data: companiesData, isLoading: loadingCompanies } = useCompanies({
    page: 1,
    limit: 500,
    enabled: showCompanySelect,
  });

  const companyOptions: CompanyOption[] = useMemo(
    () => (companiesData?.companies ?? []).map((c) => ({ value: c.id, label: c.name })),
    [companiesData?.companies],
  );

  return { loadingCompanies, companyOptions };
}

