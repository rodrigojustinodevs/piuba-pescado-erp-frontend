'use client';

import { useCallback, useState } from 'react';
import type { User, UserListResponse, UserDialogMode } from '../types';
import type { UserRoleFilter, UserStatusFilter } from '../hooks/useUsersListPage';
import { UserTable } from './UserTable';
import { UserDialog } from './UserDialog';
import { UserRoleDialog } from './UserRoleDialog';
import { ListHeader, Pagination, SearchField, StatusFilterTabs } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { StatCard } from '@/shared/components/Cards/StatCard';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { ROLE_OPTIONS } from '../utils/roleLabels';
import { STATUS_FILTER_OPTIONS } from '../utils/statusLabels';
import { Eye, Loader2, Pencil, ShieldCheck, Trash, UserCheck, UserX, Users } from 'lucide-react';

export type UsersListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: UserStatusFilter;
  setFilter: (next: UserStatusFilter) => void;
  roleFilter: UserRoleFilter;
  setRoleFilter: (next: UserRoleFilter) => void;
  data: UserListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredUsers: User[];
  stats: {
    total: number;
    active: number;
    admins: number;
    blocked: number;
  };
  handleDelete: (id: string, name: string) => void;
  isDeleting: boolean;
};

export function UsersListView({
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
  isDeleting,
}: Readonly<UsersListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<UserDialogMode>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRoleUser, setSelectedRoleUser] = useState<User | null>(null);

  const openUserDialog = useCallback((mode: UserDialogMode, user: User | null = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    setDialogOpen(true);
  }, []);

  const openRoleDialog = useCallback((user: User) => {
    setSelectedRoleUser(user);
    setRoleDialogOpen(true);
  }, []);

  const getRowActions = useCallback(
    (user: User) => [
      {
        label: 'Ver detalhes',
        onClick: () => openUserDialog('view', user),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openUserDialog('edit', user),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Alterar perfil',
        onClick: () => openRoleDialog(user),
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(user.id, user.name),
        variant: 'danger' as const,
        disabled: isDeleting,
        icon: isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        ),
      },
    ],
    [handleDelete, openUserDialog, openRoleDialog, isDeleting],
  );

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error)
      return (
        <ListErrorState
          title="Erro ao carregar usuários"
          message="Não foi possível carregar os usuários. Tente novamente."
        />
      );
    if (!filteredUsers.length) return <ListEmptyState title="Nenhum usuário encontrado." />;

    return (
      <>
        <UserTable users={filteredUsers} rowActions={getRowActions} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="usuários"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Users className="h-8 w-8 text-[#0EA5A4]" />}
        title="Usuários"
        subtitle="Gerencie acesso, perfis e permissões da equipe"
        dialogOpen
        dialogLabel="Novo Usuário"
        setDialogOpen={() => openUserDialog('create')}
      />
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
        mode={dialogMode}
        user={selectedUser}
      />
      <UserRoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSuccess={() => setRoleDialogOpen(false)}
        user={selectedRoleUser}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total"
          value={stats.total}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          label="Ativos"
          value={stats.active}
          icon={<UserCheck className="h-4 w-4 text-emerald-600" />}
        />
        <StatCard
          label="Administradores"
          value={stats.admins}
          icon={<ShieldCheck className="h-4 w-4 text-[#0EA5A4]" />}
        />
        <StatCard
          label="Bloqueados"
          value={stats.blocked}
          icon={<UserX className="h-4 w-4 text-destructive" />}
        />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <SearchField
            search={search}
            setSearch={setSearch}
            setCurrentPage={setPage}
            placeholder="Buscar por nome, e-mail ou cargo..."
          />

          <StatusFilterTabs
            filter={roleFilter}
            onChange={setRoleFilter}
            options={[{ value: 'all', label: 'Todos os perfis' }, ...ROLE_OPTIONS]}
          />

          <StatusFilterTabs filter={filter} onChange={setFilter} options={STATUS_FILTER_OPTIONS} />
        </CardContent>
      </Card>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
