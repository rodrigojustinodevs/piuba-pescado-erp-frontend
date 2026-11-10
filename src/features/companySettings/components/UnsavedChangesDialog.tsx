'use client';

import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';

type Props = Readonly<{
  open: boolean;
  onStay: () => void;
  onDiscard: () => void;
}>;

export function UnsavedChangesDialog({ open, onStay, onDiscard }: Props) {
  return (
    <Dialog open={open} onOpenChange={(next) => (next ? null : onStay())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Descartar alterações?</DialogTitle>
          <DialogDescription>
            Há alterações não salvas nesta aba. Se sair agora, elas serão perdidas.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onStay}>
            Continuar editando
          </Button>
          <Button variant="destructive" onClick={onDiscard}>
            Descartar e sair
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
