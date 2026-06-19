'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCompanies } from '@/features/company';
import { useCreateTank, useTankTypes, useUpdateTank } from '@/features/tank';
import { createTankSchema, type CreateTankFormData } from '../schemas';
import type {
  CreateTankData,
  Tank,
  TankDialogMode,
  UpdateTankData,
} from '../types';
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
import { Building2, Calendar, Droplets, Loader2, MapPin } from 'lucide-react';
import { InfoRow } from '@/shared/components/entityDetail';

interface TankDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly mode?: TankDialogMode;
  readonly tank?: Tank | null;
}

const initialForm: CreateTankFormData = {
  companyId: '',
  tankTypeId: '',
  name: '',
  capacityLiters: 0,
  location: '',
  status: 'active',
};

const statusLabel: Record<
  Tank['status'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  active: { label: 'Ativo', variant: 'default' },
  inactive: { label: 'Inativo', variant: 'secondary' },
  maintenance: { label: 'Manutenção', variant: 'destructive' },
};

function tankToForm(tank: Tank): CreateTankFormData {
  return {
    companyId: tank.company.id ?? '',
    tankTypeId: tank.tankType?.id ?? '',
    name: tank.name,
    capacityLiters: tank.capacityLiters,
    location: tank.location ?? '',
    status: tank.status === 'maintenance' ? 'inactive' : tank.status,
  };
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR');
}

function formatCapacity(capacityLiters: number) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(capacityLiters);
}

export function TankDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  tank = null,
}: Readonly<TankDialogProps>) {
  const { isMaster, user } = useAuthContext();
  const { data: companiesData } = useCompanies({ limit: 1000 });

  const { data: tankTypesData, isLoading: isLoadingTypes } = useTankTypes();
  const createTank = useCreateTank();
  const updateTank = useUpdateTank();
  const saving = createTank.isPending || updateTank.isPending;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateTankFormData>({
    resolver: zodResolver(createTankSchema),
    defaultValues: initialForm,
  });

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;

    if (tank) {
      reset(tankToForm(tank));
      return;
    }

    const nextForm =
      !isMaster() && user?.companyId ? { ...initialForm, companyId: user.companyId } : initialForm;
    reset(nextForm);
  }, [open, tank, reset, isMaster, user?.companyId]);

  async function onSubmit(data: CreateTankFormData) {
    if (isView) return;

    if (isEdit) {
      if (!tank?.id) return;
      const payload: UpdateTankData = { id: tank.id, ...data };
      updateTank.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
      return;
    }

    createTank.mutate(data as CreateTankData, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
    });
  }

  function handleClose(value: boolean) {
    if (!value) {
      const nextForm =
        !isMaster() && user?.companyId
          ? { ...initialForm, companyId: user.companyId }
          : initialForm;
      reset(nextForm);
    }
    onOpenChange(value);
  }

  let title = 'Novo Tanque';
  let description = 'Preencha os dados para cadastrar um novo tanque.';

  if (isView) {
    title = 'Detalhes do Tanque';
    description = 'Visualização das informações do tanque.';
  } else if (isEdit) {
    title = 'Editar Tanque';
    description = 'Atualize os dados do tanque abaixo.';
  }

  if (isView && tank) {
    const status = statusLabel[tank.status];

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Droplets className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold">{tank.name}</h3>
                <p className="text-sm text-muted-foreground">{tank.tankType.name}</p>
                <Badge variant={status.variant} className="mt-2">
                  {status.label}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Droplets className="h-4 w-4" />}
                label="Capacidade"
                value={`${formatCapacity(tank.capacityLiters)} L`}
              />
              {isMaster() && (
                <InfoRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Empresa"
                  value={tank.company.name || '—'}
                />
              )}
              <InfoRow
                icon={<MapPin className="h-4 w-4" />}
                label="Localização"
                value={tank.location || '—'}
                className="sm:col-span-2"
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Criado em"
                value={formatDate(tank.createdAt)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Atualizado em"
                value={formatDate(tank.updatedAt)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
            <h3 className="text-sm font-semibold text-muted-foreground">Dados do tanque</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {isMaster() ? (
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
                          {(companiesData?.companies ?? []).map((company) => (
                            <SelectItem key={company.id} value={String(company.id)}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-xs text-destructive">{errors.companyId.message}</p>
                  )}
                </div>
              ) : (
                <input type="hidden" {...register('companyId')} />
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Nome do tanque" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tankTypeId">Tipo de tanque *</Label>
                <Controller
                  name="tankTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoadingTypes}
                    >
                      <SelectTrigger id="tankTypeId">
                        <SelectValue
                          placeholder={isLoadingTypes ? 'Carregando tipos...' : 'Selecione um tipo'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(tankTypesData?.tankTypes ?? []).map((type) => (
                          <SelectItem key={type.id} value={String(type.id)}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tankTypeId && (
                  <p className="text-xs text-destructive">{errors.tankTypeId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacityLiters">Capacidade (litros) *</Label>
                <Input
                  id="capacityLiters"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('capacityLiters', { valueAsNumber: true })}
                />
                {errors.capacityLiters && (
                  <p className="text-xs text-destructive">{errors.capacityLiters.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value: 'active' | 'inactive') => {
                        field.onChange(value);
                        setValue('status', value, { shouldDirty: true, shouldValidate: true });
                      }}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Ex: Setor A - Bloco 3"
                  {...register('location')}
                />
                {errors.location && (
                  <p className="text-xs text-destructive">{errors.location.message}</p>
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

