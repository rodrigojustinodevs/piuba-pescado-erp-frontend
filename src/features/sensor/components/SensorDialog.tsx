'use client';

import { useEffect, type ReactNode } from 'react';
import { Controller, useForm, type FieldErrors, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTanks } from '@/features/tank/hooks/useTanks';
import { useCompanies } from '@/features/company/hooks/useCompanies';
import { useCreateSensor } from '../hooks/useCreateSensor';
import { useUpdateSensor } from '../hooks/useUpdateSensor';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';
import type {
  CreateSensorData,
  Sensor,
  SensorDialogMode,
  SensorStatus,
  SensorType,
  UpdateSensorData,
} from '../types';
import {
  createSensorDialogSchema,
  updateSensorDialogSchema,
  type CreateSensorDialogFormData,
} from '../schemas';
import { getSensorStatusLabel, getSensorTypeLabel } from '../utils/sensorDisplayLabels';
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
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';
import { formatSensorReadingValue } from '../../sensorReading/utils/formatSensorReadingDisplay';
import { Building2, Calendar, Droplets, Gauge, Loader2, Wrench, RadioTower } from 'lucide-react';

type SensorDialogFormData = CreateSensorDialogFormData;

interface SensorDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess: () => void;
  readonly mode?: SensorDialogMode;
  readonly sensor?: Sensor | null;
}

const sensorTypeOptions: Array<{ value: SensorType; label: string }> = [
  { value: 'temperature', label: 'Temperatura' },
  { value: 'ph', label: 'pH' },
  { value: 'dissolved_oxygen', label: 'Oxigênio Dissolvido' },
  { value: 'ammonia', label: 'Amônia' },
  { value: 'etc', label: 'Outros' },
];

const sensorStatusOptions: Array<{ value: SensorStatus; label: string }> = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'maintenance', label: 'Manutenção' },
];

const createDefaults: CreateSensorDialogFormData = {
  companyId: '',
  tankId: '',
  sensorType: 'temperature',
  name: '',
  serialNumber: '',
  battery: 0,
  unit: '',
  lastReading: 0,
  installationDate: '',
  status: 'active',
  notes: '',
};

const statusBadgeVariant: Record<SensorStatus, 'default' | 'secondary' | 'destructive'> = {
  active: 'default',
  inactive: 'destructive',
  maintenance: 'secondary',
};

const createDialogResolver = zodResolver(createSensorDialogSchema) as Resolver<SensorDialogFormData>;
const updateDialogResolver = zodResolver(updateSensorDialogSchema) as unknown as Resolver<SensorDialogFormData>;

function toUpdateDefaults(sensor: Sensor): CreateSensorDialogFormData {
  const installationDate = sensor.installationDate
    ? new Date(sensor.installationDate).toISOString().slice(0, 16)
    : '';

  return {
    companyId: '',
    tankId: sensor.tankId,
    sensorType: sensor.sensorType,
    name: sensor.name,
    serialNumber: sensor.serialNumber,
    battery: sensor.battery ?? 0,
    unit: sensor.unit,
    lastReading: sensor.lastReading ?? 0,
    installationDate,
    status: (sensor.status as SensorStatus) || 'active',
    notes: sensor.notes ?? '',
  };
}

export function SensorDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  sensor = null,
}: Readonly<SensorDialogProps>) {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const { isMaster, user } = useAuthContext();
  const { showError } = useToast();
  const showCompanyField = isMaster();
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies({
    page: 1,
    limit: 1000,
    enabled: open && !isEdit && !isView && showCompanyField,
  });
  const { data: tanksData, isLoading: isLoadingTanks } = useTanks({
    page: 1,
    limit: 1000,
    enabled: open && !isView,
  });
  const createSensor = useCreateSensor();
  const updateSensor = useUpdateSensor();
  const isSubmitting = isEdit ? updateSensor.isPending : createSensor.isPending;

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<SensorDialogFormData>({
    resolver: isEdit ? updateDialogResolver : createDialogResolver,
    defaultValues: createDefaults,
  });

  function onInvalid(validationErrors: FieldErrors<SensorDialogFormData>) {
    const fieldLabels: Record<keyof SensorDialogFormData, string> = {
      companyId: 'Empresa',
      tankId: 'Tanque',
      sensorType: 'Tipo',
      name: 'Nome',
      serialNumber: 'Número de série',
      battery: 'Bateria',
      unit: 'Unidade',
      lastReading: 'Última leitura',
      installationDate: 'Data de instalação',
      status: 'Status',
      notes: 'Observações',
    };

    const invalidFields = Object.keys(validationErrors)
      .map((key) => fieldLabels[key as keyof SensorDialogFormData] ?? key)
      .slice(0, 4);

    if (invalidFields.length === 0) {
      showError('Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    showError(`Campos inválidos: ${invalidFields.join(', ')}.`);
  }

  useEffect(() => {
    if (!open) return;
    if ((isEdit || isView) && sensor) {
      reset(toUpdateDefaults(sensor));
      return;
    }
    reset({
      ...createDefaults,
      companyId: !showCompanyField ? (user?.companyId ?? '') : '',
    });
  }, [open, isEdit, isView, sensor, reset, showCompanyField, user?.companyId]);

  const tanks = tanksData?.tanks ?? [];
  const companies = companiesData?.companies ?? [];

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) {
      reset(
        isEdit && sensor
          ? toUpdateDefaults(sensor)
          : {
              ...createDefaults,
              companyId: !showCompanyField ? (user?.companyId ?? '') : '',
            },
      );
    }
    onOpenChange(nextOpen);
  }

  function onSubmit(formData: SensorDialogFormData) {
    if (isView) return;

    if (isEdit) {
      if (!sensor?.id) {
        showError('Não foi possível salvar: sensor sem identificador.');
        return;
      }
      const updatePayload: UpdateSensorData = {
        id: sensor.id,
        sensorType: formData.sensorType,
        name: formData.name.trim(),
        serialNumber: formData.serialNumber.trim(),
        battery: Number(formData.battery),
        unit: formData.unit.trim(),
        lastReading: Number(formData.lastReading),
        installationDate: formData.installationDate,
        status: formData.status,
        notes: formData.notes?.trim() ? formData.notes.trim() : null,
      };
      updateSensor.mutate(updatePayload, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
      return;
    }

    const companyId = showCompanyField ? formData.companyId : user?.companyId;
    if (!companyId) {
      setError('companyId', { type: 'manual', message: 'Empresa é obrigatória' });
      return;
    }

    const createPayload: CreateSensorData = {
      companyId,
      tankId: formData.tankId,
      sensorType: formData.sensorType,
      name: formData.name.trim(),
      serialNumber: formData.serialNumber.trim(),
      battery: Number(formData.battery),
      unit: formData.unit.trim(),
      lastReading: Number(formData.lastReading),
      installationDate: formData.installationDate,
      status: formData.status,
      notes: formData.notes?.trim() ? formData.notes.trim() : null,
    };

    createSensor.mutate(createPayload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  }

  let title = 'Novo Sensor';
  let description = 'Preencha os dados para cadastrar um novo sensor.';

  if (isView) {
    title = 'Detalhes do Sensor';
    description = 'Visualização das informações do sensor.';
  } else if (isEdit) {
    title = 'Editar Sensor';
    description = 'Atualize os dados operacionais do sensor.';
  }

  if (isView && sensor) {
    const sensorStatus = (sensor.status as SensorStatus) || 'active';

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
                <RadioTower className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-lg font-semibold">{sensor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {getSensorTypeLabel(sensor.sensorType)}
                </p>
                <Badge variant={statusBadgeVariant[sensorStatus]} className="mt-2">
                  {getSensorStatusLabel(sensor.status)}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Droplets className="h-4 w-4" />}
                label="Viveiro"
                value={sensor.tank?.name || '—'}
              />
              {isMaster() && (
                <InfoRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Empresa"
                  value={sensor.company?.name || '—'}
                />
              )}
              <InfoRow
                icon={<Wrench className="h-4 w-4" />}
                label="Serial"
                value={sensor.serialNumber || '—'}
              />
              <InfoRow
                icon={<Gauge className="h-4 w-4" />}
                label="Última leitura"
                value={
                  sensor.lastReading === null
                    ? '—'
                    : formatSensorReadingValue(sensor.lastReading, sensor.unit)
                }
              />
              <InfoRow
                icon={<Gauge className="h-4 w-4" />}
                label="Bateria"
                value={`${sensor.battery ?? 0}%`}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Instalação"
                value={formatNullableDatePtBR(sensor.installationDate, true)}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Atualizado em"
                value={formatNullableDatePtBR(sensor.updatedAt, true)}
              />
              <InfoRow
                icon={<Wrench className="h-4 w-4" />}
                label="Observações"
                value={sensor.notes || '—'}
                className="sm:col-span-2"
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

        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {!isEdit && showCompanyField && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="companyId">Empresa *</Label>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || isLoadingCompanies}
                    >
                      <SelectTrigger id="companyId">
                        <SelectValue
                          placeholder={
                            isLoadingCompanies ? 'Carregando empresas...' : 'Selecione a empresa'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
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
            )}

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="tankId">Tanque *</Label>
                <Controller
                  name="tankId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting || isLoadingTanks}
                    >
                      <SelectTrigger id="tankId">
                        <SelectValue
                          placeholder={
                            isLoadingTanks ? 'Carregando tanques...' : 'Selecione o tanque'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {tanks.map((tank) => (
                          <SelectItem key={tank.id} value={tank.id}>
                            {tank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tankId && (
                  <p className="text-xs text-destructive">{errors.tankId.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="sensorType">Tipo *</Label>
              <Controller
                name="sensorType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger id="sensorType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensorTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sensorType && (
                <p className="text-xs text-destructive">{errors.sensorType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Número de série *</Label>
              <Input
                id="serialNumber"
                placeholder="SN-TEMP-0001"
                disabled={isSubmitting}
                {...register('serialNumber')}
              />
              {errors.serialNumber && (
                <p className="text-xs text-destructive">{errors.serialNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidade *</Label>
              <Input id="unit" placeholder="Ex.: C" disabled={isSubmitting} {...register('unit')} />
              {errors.unit && <p className="text-xs text-destructive">{errors.unit.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="installationDate">Data de instalação *</Label>
              <Input
                id="installationDate"
                type="datetime-local"
                disabled={isSubmitting}
                {...register('installationDate')}
              />
              {errors.installationDate && (
                <p className="text-xs text-destructive">{errors.installationDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" placeholder="Sensor Temperatura Viveiro 01" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="battery">Bateria (%) *</Label>
              <Input
                id="battery"
                type="number"
                min={0}
                max={100}
                {...register('battery', { valueAsNumber: true })}
              />
              {errors.battery && (
                <p className="text-xs text-destructive">{errors.battery.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastReading">Última leitura *</Label>
              <Input
                id="lastReading"
                type="number"
                step="any"
                {...register('lastReading', { valueAsNumber: true })}
              />
              {errors.lastReading && (
                <p className="text-xs text-destructive">{errors.lastReading.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="status">Status *</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {sensorStatusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <textarea
                id="notes"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Observações opcionais"
                {...register('notes')}
              />
              {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface InfoRowProps {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
  readonly className?: string;
}

function InfoRow({ icon, label, value, className }: Readonly<InfoRowProps>) {
  return (
    <div className={`space-y-1 ${className ?? ''}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="break-words text-sm">{value}</p>
    </div>
  );
}
