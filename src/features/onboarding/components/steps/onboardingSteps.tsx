import type { OnboardingStepDefinition } from '../../types';
import { TanksStep } from './TanksStep';

/** Registro dos passos do onboarding — adicionar novos passos aqui. */
export const ONBOARDING_STEPS: OnboardingStepDefinition[] = [
  {
    id: 'tanks',
    title: 'Cadastro de Tanques',
    description:
      'Antes de iniciar as operações da fazenda, cadastre todos os tanques disponíveis. Eles serão utilizados nos módulos de povoamento, biomassa, transferências, manejo, colheita e vendas.',
    canSkip: false,
    render: () => <TanksStep />,
  },
];
