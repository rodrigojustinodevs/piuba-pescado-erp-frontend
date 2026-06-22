import { useCallback, useMemo, useState } from 'react';
import type { Batch } from '@/features/batch/types';
import type { Tank } from '@/features/tank/types';
import { batchService } from '@/features/batch/services/batchService';
import { useBatches } from '@/features/batch';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useCompanyOptions } from '@/shared/hooks/useCompanyOptions';
import { useToast } from '@/shared/contexts/ToastContext';

type LoadTanksFn = (companyId: string) => Promise<{ tanks: Tank[] }>;

type Params = {
  isEditMode: boolean;
  loadTanks: LoadTanksFn;
  errorMessage?: string;
};

export function useCompanyBatchData({
  isEditMode,
  loadTanks,
  errorMessage = 'Erro ao carregar dados da empresa.',
}: Params) {
  const { isMaster } = useAuthContext();
  const { showError } = useToast();
  const showCompanyField = isMaster() && !isEditMode;
  const { companyOptions, loadingCompanies } = useCompanyOptions(showCompanyField);

  const [companyBatches, setCompanyBatches] = useState<Batch[]>([]);
  const [companyTanks, setCompanyTanks] = useState<Tank[]>([]);
  const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(false);
  const [companyDataLoaded, setCompanyDataLoaded] = useState(false);

  const { data: batchesData, isLoading: isLoadingBatches } = useBatches({
    page: 1,
    limit: 1000,
    enabled: !showCompanyField,
  });
  const defaultBatches = useMemo(() => batchesData?.batches ?? [], [batchesData]);
  const batches = showCompanyField ? companyBatches : defaultBatches;
  const isLoadingBatchesEffective = showCompanyField ? isLoadingCompanyData : isLoadingBatches;

  const loadCompanyData = useCallback(
    async (companyId: string) => {
      setIsLoadingCompanyData(true);
      setCompanyDataLoaded(false);
      setCompanyBatches([]);
      setCompanyTanks([]);
      try {
        const [batchRes, tankRes] = await Promise.all([
          batchService.getBatches({ page: 1, limit: 1000, companyId }),
          loadTanks(companyId),
        ]);
        setCompanyBatches(batchRes.batches);
        setCompanyTanks(tankRes.tanks);
        setCompanyDataLoaded(true);
      } catch {
        showError(errorMessage);
      } finally {
        setIsLoadingCompanyData(false);
      }
    },
    [loadTanks, showError, errorMessage],
  );

  const resetCompanyData = useCallback(() => {
    setCompanyBatches([]);
    setCompanyTanks([]);
    setCompanyDataLoaded(false);
  }, []);

  return {
    showCompanyField,
    companyOptions,
    loadingCompanies,
    companyTanks,
    isLoadingCompanyData,
    companyDataLoaded,
    batches,
    isLoadingBatchesEffective,
    loadCompanyData,
    resetCompanyData,
  };
}
