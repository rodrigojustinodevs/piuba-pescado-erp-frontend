'use client';

import { useCallback, useMemo, useState } from 'react';
import { useDeleteUser } from './useDeleteUser';
import { useUsers } from './useUsers';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import { UserRole, type UserRoleType } from '@/shared/types/auth';

export type UserStatusFilter = 'all' | 'active' | 'inactive' | 'blocked';
export type UserRoleFilter = UserRoleType;

const ADMIN_ROLES = new Set<UserRoleType>([
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
]);

export function useUsersListPage() {
  const listState = useListPageState<UserStatusFilter>({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter } = listState;
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all');

  const { data, isLoading, error } = useUsers({ page, limit: 10, search });
  const deleteUser = useDeleteUser();
  const { showError } = useAlertModal();

  const filteredUsers = useMemo(() => {
    let list = data?.users ?? [];
    if (filter !== 'all') {
      list = list.filter((u) => u.status === filter);
    }
    if (roleFilter !== 'all') {
      list = list.filter((u) => u.role === roleFilter);
    }
    return list;
  }, [data?.users, filter, roleFilter]);

  const stats = useMemo(() => {
    const users = data?.users ?? [];
    return {
      total: data?.total ?? users.length,
      active: users.filter((u) => u.status === 'active').length,
      admins: users.filter((u) => ADMIN_ROLES.has(u.role)).length,
      blocked: users.filter((u) => u.status === 'blocked').length,
    };
  }, [data?.users, data?.total]);

  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir o usuário "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteUser.mutate(id),
      );
    },
    [showError, deleteUser],
  );

  return {
    page,
    setPage,
    search,
    setSearch,
    filter,
    setFilter,
    roleFilter,
    setRoleFilter,
    data,
    isLoading,
    error,
    filteredUsers,
    stats,
    handleDelete,
    isDeleting: deleteUser.isPending,
  };
}
