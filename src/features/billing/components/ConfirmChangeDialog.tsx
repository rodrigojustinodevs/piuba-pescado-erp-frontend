'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import type { ChangePreview } from '../utils/changePreview';
import { ActionError } from './states';

type Props = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: ChangePreview;
  pending: boolean;
  cooldown: number;
  error: unknown;
  onConfirm: () => void;
  /** Campos de escolha (plano, ciclo, forma de pagamento) acima dos avisos. */
  children?: ReactNode;
}>;

/** Diálogo de confirmação: mostra os avisos da troca antes do usuário confirmar. */
export function ConfirmChangeDialog({
  open,
  onOpenChange,
  preview,
  pending,
  cooldown,
  error,
  onConfirm,
  children,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !pending && onOpenChange(v)}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{preview.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Revise os detalhes antes de confirmar.
          </DialogDescription>
        </DialogHeader>

        {children}

        {preview.warnings.length > 0 ? (
          <ul
            className={
              preview.destructive
                ? 'flex flex-col gap-1.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900'
                : 'flex flex-col gap-1.5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950'
            }
          >
            {preview.warnings.map((w) => (
              <li key={w} className="flex gap-2">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        ) : null}

        <ActionError error={error} />

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Voltar
          </Button>
          <Button
            type="button"
            variant={preview.destructive ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={pending || cooldown > 0 || !preview.requiresConfirmation}
          >
            {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
            {cooldown > 0 ? `Tente em ${cooldown} s` : preview.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
