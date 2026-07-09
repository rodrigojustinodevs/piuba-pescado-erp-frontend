'use client';

import { Mail, Phone } from 'lucide-react';
import type { User, UserTableProps } from '../types';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { getAvatarColorClassName, getInitials } from '../utils/avatarColor';
import { getRoleBadgeClassName, getRoleLabel } from '../utils/roleLabels';
import { getPositionLabel } from '../utils/positionLabels';
import { STATUS_BADGE_STYLES, STATUS_LABELS } from '../utils/statusLabels';
import { formatDateTimeLocal } from '@/shared/utils/dateFormat';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { Badge } from '@/shared/components/ui/Badge';

function UserCell({ user }: Readonly<{ user: User }>) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getAvatarColorClassName(user.id || user.name)}`}
      >
        {getInitials(user.name)}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-900">{user.name}</div>
        <div className="text-xs text-slate-400">{getPositionLabel(user.position)}</div>
      </div>
    </div>
  );
}

function ContactCell({ user }: Readonly<{ user: User }>) {
  return (
    <div className="space-y-1 text-sm">
      <div className="flex items-center gap-1.5 text-slate-500">
        <Mail className="h-3 w-3 shrink-0" />
        <span className="truncate">{user.email || '—'}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-500">
        <Phone className="h-3.5 w-3.5 shrink-0" />
        <span>{user.phone || '—'}</span>
      </div>
    </div>
  );
}

function buildColumns(showCompanyColumn: boolean): Array<DataTableColumn<User>> {
  return [
    {
      id: 'name',
      header: 'Usuário',
      cell: (user) => <UserCell user={user} />,
    },
    {
      id: 'contact',
      header: 'Contato',
      cell: (user) => <ContactCell user={user} />,
    },
    {
      id: 'role',
      header: 'Perfil',
      cell: (user) => (
        <Badge variant="outline" className={getRoleBadgeClassName(user.role)}>
          {getRoleLabel(user.role)}
        </Badge>
      ),
    },
    ...(showCompanyColumn
      ? ([
          {
            id: 'company',
            header: 'Empresa',
            cell: (user) => (
              <span className="text-sm text-slate-600">{user.company?.name || '—'}</span>
            ),
          },
        ] as Array<DataTableColumn<User>>)
      : []),
    {
      id: 'status',
      header: 'Status',
      cell: (user) => (
        <Badge variant="outline" className={STATUS_BADGE_STYLES[user.status]}>
          {STATUS_LABELS[user.status]}
        </Badge>
      ),
    },
    {
      id: 'lastAccessAt',
      header: 'Último acesso',
      cellClassName: 'text-sm text-muted-foreground',
      cell: (user) => (user.lastAccessAt ? formatDateTimeLocal(user.lastAccessAt) : '—'),
    },
  ];
}

export function UserTable({ users, rowActions }: Readonly<UserTableProps>) {
  const { isMaster } = useAuthContext();
  const columns = buildColumns(isMaster());

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      rowActions={rowActions}
      emptyState={<div className="p-8 text-center text-slate-500">Nenhum usuário encontrado.</div>}
    />
  );
}
