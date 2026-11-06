'use client';

import { useMemo } from 'react';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import type { NavGroupWithAuth } from '../menuConfig';
import { filterMenuItemsByAuth, toMenuItem } from '../utils/menuAuthorization';
import type { NavGroup } from '../types';

/** Filtra os itens de cada grupo pelas permissões do usuário e descarta grupos vazios. */
export function useMenuGroupsAuthorization(groups: NavGroupWithAuth[]): NavGroup[] {
  const { user } = useAuthContext();

  return useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: filterMenuItemsByAuth(group.items, user).map(toMenuItem),
        }))
        .filter((group) => group.items.length > 0),
    [groups, user],
  );
}
