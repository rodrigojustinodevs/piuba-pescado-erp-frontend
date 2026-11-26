'use client';

import { useEffect } from 'react';
import { Controller, useForm, type Control, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/features/company';
import { useCreateUser } from '../hooks/useCreateUser';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { createUserSchema, type CreateUserFormData } from '../schemas';
import type { CreateUserData, User, UserDialogMode, UpdateUserData } from '../types';
import { ROLE_OPTIONS, getRoleLabel } from '../utils/roleLabels';
import { POSITION_OPTIONS } from '../utils/positionLabels';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/Dialog';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Label } from '@/shared/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/Select';
import { Badge } from '@/shared/components/ui/Badge';
import { Loader2 } from 'lucide-react';
import { UserDetailsDialog } from './UserDetailsDialog';

interface UserDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly mode?: UserDialogMode;
  readonly user?: User | null;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  readonly onEdit?: () => void;
}

const initialForm: CreateUserFormData = {
  companyId: '',
  name: '',
  email: '',
  phone: '',
  position: '',
  role: 'operator',
  status: 'active',
};

function buildInitialFormForMaster(): CreateUserFormData {
  return initialForm;
}

function buildInitialFormForCompanyUser(
  companyId: number | string | null | undefined,
): CreateUserFormData {
  return companyId ? { ...initialForm, companyId: String(companyId) } : initialForm;
}

type CompanyIdFieldProps = {
  isMasterUser: boolean;
  control: Control<CreateUserFormData>;
  register: UseFormRegister<CreateUserFormData>;
  companies: { id: string | number; name: string }[];
  error?: string;
};

function CompanyIdField({
  isMasterUser,
  control,
  register,
  companies,
  error,
}: Readonly<CompanyIdFieldProps>) {
  if (!isMasterUser) {
    return <input type="hidden" {...register('companyId')} />;
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label htmlFor="companyId">Empresa *</Label>
      <Controller
        name="companyId"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id="companyId">
              <SelectValue placeholder="Selecione a empresa" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={String(company.id)}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function userToForm(user: User): CreateUserFormData {
  return {
    companyId: String(user.company?.id ?? ''),
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    position: user.position ?? '',
    role: user.role,
    status: user.status,
  };
}

export function UserDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  user = null,
  onEdit,
}: Readonly<UserDialogProps>) {
  const { isMaster, user: authUser } = useAuthContext();
  const isMasterUser = isMaster();
  const { data: companiesData } = useCompanies({ limit: 1000, enabled: open });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const saving = createUser.isPending || updateUser.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: initialForm,
  });

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;

    if (user) {
      reset(userToForm(user));
      return;
    }

    reset(
      isMasterUser
        ? buildInitialFormForMaster()
        : buildInitialFormForCompanyUser(authUser?.companyId),
    );
  }, [open, user, reset, isMasterUser, authUser?.companyId]);

  function onSubmit(data: CreateUserFormData) {
    if (isView) return;

    if (isEdit) {
      if (!user?.id) return;
      // role nunca deve ser enviado por este update genérico
      const { role: _role, ...editableFields } = data;
      const payload: UpdateUserData = { id: user.id, ...editableFields };
      updateUser.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
      return;
    }

    createUser.mutate(data as CreateUserData, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }

  function handleClose(value: boolean) {
    if (!value) {
      reset(
        isMasterUser
          ? buildInitialFormForMaster()
          : buildInitialFormForCompanyUser(authUser?.companyId),
      );
    }
    onOpenChange(value);
  }

  if (isView) {
    return (
      <UserDetailsDialog user={user} open={open} onOpenChange={onOpenChange} onEdit={onEdit} />
    );
  }

  let title = 'Novo Usuário';
  let description = 'Preencha os dados para cadastrar um novo usuário.';

  if (isEdit) {
    title = 'Editar Usuário';
    description = 'Atualize os dados do usuário abaixo.';
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Dados do usuário</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <CompanyIdField
                isMasterUser={isMasterUser}
                control={control}
                register={register}
                companies={companiesData?.companies ?? []}
                error={errors.companyId?.message}
              />

              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Nome completo" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@empresa.com"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="(00) 00000-0000" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Cargo</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.position && (
                  <p className="text-xs text-destructive">{errors.position.message}</p>
                )}
              </div>

              {isEdit ? (
                <div className="space-y-2">
                  <Label>Perfil de acesso</Label>
                  <div>
                    <Badge variant="outline">{user ? getRoleLabel(user.role) : '—'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para alterar o perfil de acesso, utilize a ação &quot;Alterar perfil&quot; na
                    listagem de usuários.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="role">Perfil de acesso *</Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="role">
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
                    )}
                  />
                  {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="blocked">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
