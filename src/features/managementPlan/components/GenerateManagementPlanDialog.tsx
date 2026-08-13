'use client';

import { useGenerateManagementPlan } from '../hooks/useGenerateManagementPlan';
import { MissingSpeciesBanner } from './MissingSpeciesBanner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Loader2 } from 'lucide-react';

interface GenerateManagementPlanDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly batchId: string;
  readonly hasSpecies: boolean;
}

export function GenerateManagementPlanDialog({
  open,
  onOpenChange,
  onSuccess,
  batchId,
  hasSpecies,
}: Readonly<GenerateManagementPlanDialogProps>) {
  const generateManagementPlan = useGenerateManagementPlan();
  const saving = generateManagementPlan.isPending;

  function handleClose(value: boolean) {
    if (saving) return;
    onOpenChange(value);
  }

  function handleConfirm() {
    generateManagementPlan.mutate(batchId, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Plano de Manejo (IA)</DialogTitle>
          <DialogDescription>
            A IA vai gerar um novo plano de manejo (arraçoamento, biometria, qualidade da água e
            alertas sanitários) para este lote, com base no tanque, na espécie e nas últimas
            leituras de qualidade de água. O plano é criado como rascunho e precisa ser revisado
            antes de virar operacional.
          </DialogDescription>
        </DialogHeader>

        {!hasSpecies && <MissingSpeciesBanner />}

        {saving && (
          <p className="text-sm text-slate-600">
            Gerando plano com IA... isso pode levar até 1 minuto.
          </p>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? 'Gerando...' : 'Gerar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
