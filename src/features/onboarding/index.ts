/**
 * Barrel export para o módulo de Onboarding
 */

// Types
export type {
  OnboardingStepId,
  OnboardingStepStatus,
  OnboardingProgress,
  OnboardingStepDefinition,
} from './types';

// Services
export { onboardingService } from './services/onboardingService';

// Hooks
export {
  useOnboardingProgress,
  useUpdateOnboardingStep,
  useDismissOnboarding,
  useOnboardingGate,
} from './hooks';

// Components
export { OnboardingWizardModal } from './components';
