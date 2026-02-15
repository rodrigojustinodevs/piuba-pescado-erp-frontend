'use client';

import { useMemo } from 'react';
import { useTankTypes } from './useTankTypes';
import { useCompanies } from '@/features/company';
import { buildCompanyMap, buildTankTypeMap } from '../utils/lookups';

/**
 * Hook para obter mapas de lookup (id -> label) de tipos de tanque e empresas.
 * Mantém a lógica de dados fora dos componentes de UI.
 */
export function useTankLookups() {
  const { data: tankTypes = [], isLoading: isLoadingTypes } = useTankTypes();
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies({ limit: 1000 });

  const companyMap = useMemo(
    () => buildCompanyMap(companiesData?.companies || []),
    [companiesData?.companies],
  );

  const tankTypeMap = useMemo(() => buildTankTypeMap(tankTypes), [tankTypes]);

  return {
    tankTypeMap,
    companyMap,
    isLoading: isLoadingTypes || isLoadingCompanies,
  };
}
