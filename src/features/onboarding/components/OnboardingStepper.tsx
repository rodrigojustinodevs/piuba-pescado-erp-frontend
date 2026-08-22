'use client';

import { Progress } from '@/shared/components/ui/Progress';

interface OnboardingStepperProps {
  readonly current: number;
  readonly total: number;
}

export function OnboardingStepper({ current, total }: OnboardingStepperProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current} de {total} etapas concluídas
        </span>
        <span>{percent}%</span>
      </div>
      <Progress value={percent} className="h-2" />
    </div>
  );
}
