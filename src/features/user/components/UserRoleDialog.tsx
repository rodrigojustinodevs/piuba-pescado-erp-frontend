'use client';

import { useState } from 'react';
import { useUpdateUserRole } from '../hooks/useUpdateUserRole';
import type { User } from '../types';
import type { UserRoleType } from '@/shared/types/auth';
import { ROLE_OPTIONS, getRoleLabel } from '../utils/roleLabels';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Label } from '@/shared/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { Loader2, ShieldCheck } from 'lucide-react';

interface UserRoleDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly user: User | null;
}

export function UserRoleDialog({
  open,
  onOpenChange,
  onSuccess,
  user,
}: Readonly<UserRoleDialogProps>) {
  const [role, setRole] = useState<UserRoleType>('operator');
  const [resetKey, setResetKey] = useState<string | null>(null);
  const updateUserRole = useUpdateUserRole();

  const nextResetKey = open ? (user?.id ?? null) : null;
  if (nextResetKey !== resetKey) {
    setResetKey(nextResetKey);
    if (user) setRole(user.role);
  }

  function handleClose(value: boolean) {
    onOpenChange(value);
  }

  function handleConfirm() {
    if (!user?.id || !user.company?.id) return;

    updateUserRole.mutate(
      { id: user.id, role, companyId: user.company.id },
      {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      },
    );
  }

  const hasChanges = user != null && role !== user.role;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar perfil de acesso</DialogTitle>
          <DialogDescription>
            {user
              ? `Defina o novo perfil de acesso de ${user.name}.`
              : 'Defina o novo perfil de acesso do usuário.'}
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[#0EA5A4]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Perfil de acesso</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRoleType)}>
                <SelectTrigger id="userRole">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Perfil atual: {getRoleLabel(user.role)}
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={updateUserRole.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!hasChanges || updateUserRole.isPending}
          >
            {updateUserRole.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
