/**
 * Tipos relacionados ao onboarding guiado do Administrador da Fazenda
 */
import type { ReactNode } from 'react';
import type { ApiResponse } from '@/shared/types/api';

export type OnboardingStepId = 'tanks';
export type OnboardingStepStatus = 'pending' | 'completed' | 'skipped';

export interface OnboardingStepProgress {
  step: OnboardingStepId;
  status: OnboardingStepStatus;
  completedAt: string | null;
}

export interface OnboardingProgress {
  companyId: string;
  steps: OnboardingStepProgress[];
  dismissedAt: string | null;
  updatedAt: string;
}

/**
 * Formato retornado pelo backend externo. Este contrato ainda não existe lá —
 * precisa ser implementado pelo time de backend (ver README da feature).
 */
export interface ApiOnboardingStepProgress {
  step: string;
  status: OnboardingStepStatus;
  completedAt?: string | null;
}

export interface ApiOnboardingProgress {
  companyId: string;
  steps: ApiOnboardingStepProgress[];
  dismissedAt?: string | null;
  updatedAt: string;
}

export type ApiOnboardingResponse = ApiResponse<ApiOnboardingProgress>;

export interface DismissOnboardingData {
  dismissedAt: string;
}

export interface UpdateOnboardingStepData {
  status: Extract<OnboardingStepStatus, 'completed' | 'skipped'>;
}

/** Definição de um passo do wizard — permite adicionar novos passos sem mexer no shell. */
export interface OnboardingStepDefinition {
  id: OnboardingStepId;
  title: string;
  description: string;
  canSkip?: boolean;
  render: () => ReactNode;
}
