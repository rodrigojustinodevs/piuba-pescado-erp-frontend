'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useTanks } from '@/features/tank';
import { useOnboardingProgress } from './useOnboardingProgress';
import { useUpdateOnboardingStep } from './useUpdateOnboardingStep';
import type { OnboardingStepStatus } from '../types';

const TANKS_ROUTE_PREFIX = '/company/tanks';

/**
 * Decide se o wizard de onboarding deve aparecer e mantém o passo "tanks"
 * sincronizado com a existência real de tanques na empresa.
 *
 * Hoje existe apenas esse passo, então a lógica está resolvida diretamente
 * para ele. Ao adicionar um Passo 2, generalizar para "primeiro passo
 * pendente de ONBOARDING_STEPS" em vez de checar 'tanks' diretamente.
 */
export function useOnboardingGate() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, isCompanyAdmin, hasCompany } = useAuthContext();
  const eligible = isAuthenticated && !isLoading && isCompanyAdmin() && hasCompany();

  const { data: progress, isLoading: progressLoading } = useOnboardingProgress(eligible);
  const { data: tanksData } = useTanks({ limit: 1, enabled: eligible });
  const hasTanks = (tanksData?.total ?? 0) > 0;

  const tanksStepStatus: OnboardingStepStatus =
    progress?.steps.find((step) => step.step === 'tanks')?.status ?? 'pending';
  const canFinishTanksStep = hasTanks || tanksStepStatus !== 'pending';

  const updateStep = useUpdateOnboardingStep();

  useEffect(() => {
    if (eligible && hasTanks && tanksStepStatus === 'pending' && !updateStep.isPending) {
      updateStep.mutate({ step: 'tanks', status: 'completed' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, hasTanks, tanksStepStatus]);

  const isOnTanksRoute = pathname?.startsWith(TANKS_ROUTE_PREFIX) ?? false;
  const dismissed = Boolean(progress?.dismissedAt);
  const shouldShow = eligible && !progressLoading && !dismissed && !isOnTanksRoute;

  return {
    shouldShow,
    tanksCount: tanksData?.total ?? 0,
    canFinishTanksStep,
  };
}
