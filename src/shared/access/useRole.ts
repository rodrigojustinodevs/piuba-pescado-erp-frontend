'use client';

import { useMemo } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import type { Permission } from './permissionMatrix';
import { hasPermission, isAtLeast, isMasterRole, normalizeRole, type CompanyRole } from './roles';

/** Papel na empresa ativa (claim `role` do JWT, via AuthContext). */
export function useRole() {
  const { user } = useAuthContext();
  const raw = user?.role ?? null;
  return useMemo(
    () => ({
      role: normalizeRole(raw),
      isMaster: isMasterRole(raw),
      isAtLeast: (minimum: CompanyRole) => isAtLeast(raw, minimum),
    }),
    [raw],
  );
}

/** `usePermission('create-tank')`: segue a matriz `PermissionsEnum::forRole` da API. */
export function usePermission(permission: Permission): boolean {
  const { user } = useAuthContext();
  return hasPermission(user?.role, permission);
}
