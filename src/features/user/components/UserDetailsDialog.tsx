'use client';

import {
  Briefcase,
  Building2,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import type { User, UserStatus } from '../types';
import { getRoleLabel } from '../utils/roleLabels';
import { getPositionLabel } from '../utils/positionLabels';
import { STATUS_LABELS } from '../utils/statusLabels';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import {
  formatDateTimeShortPtBR,
  formatRelativeTimePtBR,
  normalizeServerTimestamp,
} from '@/shared/utils/dateFormat';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsStatusBadge,
  DetailsTile,
  DetailsTimestamps,
  type DetailTone,
} from '@/shared/components/detailsDialog';

type UserDetailsDialogProps = {
  readonly user: User | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const USER_STATUS_TONE: Record<UserStatus, DetailTone> = {
  active: 'success',
  inactive: 'neutral',
  blocked: 'danger',
};

function UserDetailsBody({ user }: Readonly<{ user: User }>) {
  const { isMaster } = useAuthContext();
  const lastAccess = normalizeServerTimestamp(user.lastAccessAt);
  const tone = USER_STATUS_TONE[user.status] ?? 'neutral';

  return (
    <DetailsDialogBody>
      <DetailsHero icon={UserIcon} title={user.name} tone={tone}>
        <DetailsStatusBadge tone={tone} label={STATUS_LABELS[user.status] ?? user.status} />
        <DetailsCopyId id={user.id} label="ID do usuário" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Mail} label="E-mail" span={2}>
          {user.email && <span translate="no">{user.email}</span>}
        </DetailsTile>
        <DetailsTile icon={Phone} label="Telefone">
          {user.phone}
        </DetailsTile>
        <DetailsTile icon={ShieldCheck} label="Perfil">
          {getRoleLabel(user.role)}
        </DetailsTile>
        <DetailsTile icon={Briefcase} label="Cargo">
          {user.position ? getPositionLabel(user.position) : null}
        </DetailsTile>
        <DetailsTile
          icon={Clock}
          label="Último acesso"
          emptyLabel="Nunca acessou"
          hint={lastAccess ? formatRelativeTimePtBR(lastAccess) : undefined}
        >
          {lastAccess ? (
            <span className="tabular-nums">{formatDateTimeShortPtBR(lastAccess)}</span>
          ) : null}
        </DetailsTile>
        {isMaster() && (
          <DetailsTile icon={Building2} label="Empresa" span={2} emptyLabel="Não vinculada">
            {user.company?.name}
          </DetailsTile>
        )}
      </DetailsGrid>

      <DetailsTimestamps createdAt={user.createdAt} updatedAt={user.updatedAt} />
    </DetailsDialogBody>
  );
}

export function UserDetailsDialog({ user, open, onOpenChange, onEdit }: UserDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={user ? `Detalhes do usuário ${user.name}` : 'Detalhes do usuário'}
      description="Dados de acesso e perfil do usuário."
    >
      {user ? <UserDetailsBody user={user} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={user ? onEdit : undefined}
        editLabel="Editar usuário"
      />
    </DetailsDialog>
  );
}
