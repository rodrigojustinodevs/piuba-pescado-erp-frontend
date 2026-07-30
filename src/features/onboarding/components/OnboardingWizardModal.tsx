'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { useOnboardingGate } from '../hooks/useOnboardingGate';
import { useDismissOnboarding } from '../hooks/useDismissOnboarding';
import { OnboardingStepper } from './OnboardingStepper';
import { ONBOARDING_STEPS } from './steps';

export function OnboardingWizardModal() {
  const gate = useOnboardingGate();
  const dismiss = useDismissOnboarding();
  const [closedForNow, setClosedForNow] = useState(false);

  if (!gate.shouldShow || closedForNow) return null;

  // Único passo hoje; ao adicionar mais, calcular o índice do primeiro passo pendente.
  const step = ONBOARDING_STEPS[0];
  const total = ONBOARDING_STEPS.length;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) setClosedForNow(true);
      }}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        <OnboardingStepper current={1} total={total} />

        <div className="py-2">{step.render()}</div>

        <DialogFooter className="sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            {gate.canFinishTanksStep
              ? 'Etapa concluída — você já pode fechar.'
              : 'Cadastre pelo menos um tanque para concluir esta etapa.'}
          </p>
          <Button disabled={!gate.canFinishTanksStep} onClick={() => dismiss.mutate()}>
            Concluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
