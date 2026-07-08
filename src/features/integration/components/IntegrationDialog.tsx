'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cpu, Link2, Radio } from 'lucide-react';
import { createIntegrationSchema, type CreateIntegrationFormData } from '../schemas';
import type {
  CreateIntegrationData,
  Integration,
  IntegrationDialogMode,
  UpdateIntegrationData,
} from '../types';
import { STATUS_BADGE_STYLES, STATUS_LABELS, TYPE_LABELS } from '../utils/integrationLabels';
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
import { InfoRow } from '@/shared/components/entityDetail';
import { formatNullableDatePtBR } from '@/shared/utils/dateFormat';

interface IntegrationDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly mode?: IntegrationDialogMode;
  readonly integration?: Integration | null;
  readonly onCreate: (data: CreateIntegrationData) => void;
  readonly onUpdate: (data: UpdateIntegrationData) => void;
}

const initialForm: CreateIntegrationFormData = {
  name: '',
  manufacturer: '',
  model: '',
  type: 'sensor',
  protocol: 'HTTP',
  endpoint: '',
};

function integrationToForm(integration: Integration): CreateIntegrationFormData {
  return {
    name: integration.name,
    manufacturer: integration.manufacturer,
    model: integration.model,
    type: integration.type,
    protocol: integration.protocol,
    endpoint: integration.endpoint,
  };
}

export function IntegrationDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  integration = null,
  onCreate,
  onUpdate,
}: Readonly<IntegrationDialogProps>) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateIntegrationFormData>({
    resolver: zodResolver(createIntegrationSchema),
    defaultValues: initialForm,
  });

  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (!open) return;
    reset(integration ? integrationToForm(integration) : initialForm);
  }, [open, integration, reset]);

  function onSubmit(data: CreateIntegrationFormData) {
    if (isView) return;

    if (isEdit) {
      if (!integration?.id) return;
      onUpdate({ id: integration.id, ...data });
      onOpenChange(false);
      onSuccess?.();
      return;
    }

    onCreate(data);
    onOpenChange(false);
    onSuccess?.();
  }

  function handleClose(value: boolean) {
    if (!value) reset(initialForm);
    onOpenChange(value);
  }

  let title = 'Nova Integração';
  let description = 'Preencha os dados para cadastrar uma nova integração IoT.';

  if (isView) {
    title = 'Detalhes da Integração';
    description = 'Visualização das informações da integração.';
  } else if (isEdit) {
    title = 'Editar Integração';
    description = 'Atualize os dados da integração abaixo.';
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isView && integration ? (
          <>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Radio className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {integration.manufacturer} · {integration.model}
                  </p>
                  <Badge className={`mt-2 ${STATUS_BADGE_STYLES[integration.status]}`}>
                    {STATUS_LABELS[integration.status]}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow icon={<Radio className="h-4 w-4" />} label="Tipo" value={TYPE_LABELS[integration.type]} />
                <InfoRow icon={<Cpu className="h-4 w-4" />} label="Protocolo" value={integration.protocol} />
                <InfoRow
                  icon={<Link2 className="h-4 w-4" />}
                  label="Endpoint"
                  value={integration.endpoint}
                  className="sm:col-span-2"
                />
                <InfoRow
                  icon={<Cpu className="h-4 w-4" />}
                  label="Dispositivos"
                  value={String(integration.deviceCount)}
                />
                <InfoRow
                  icon={<Radio className="h-4 w-4" />}
                  label="Última sincronização"
                  value={formatNullableDatePtBR(integration.lastSyncAt, true)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleClose(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Ex: Gateway Viveiros Setor A" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Fabricante *</Label>
                <Input id="manufacturer" placeholder="Ex: AquaTech" {...register('manufacturer')} />
                {errors.manufacturer && (
                  <p className="text-xs text-destructive">{errors.manufacturer.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Modelo *</Label>
                <Input id="model" placeholder="Ex: AT-GW-2000" {...register('model')} />
                {errors.model && <p className="text-xs text-destructive">{errors.model.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol">Protocolo *</Label>
                <Controller
                  name="protocol"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="protocol">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MQTT">MQTT</SelectItem>
                        <SelectItem value="HTTP">HTTP</SelectItem>
                        <SelectItem value="Modbus">Modbus</SelectItem>
                        <SelectItem value="LoRaWAN">LoRaWAN</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.protocol && (
                  <p className="text-xs text-destructive">{errors.protocol.message}</p>
                )}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="endpoint">Endpoint *</Label>
                <Input
                  id="endpoint"
                  placeholder="Ex: mqtt://gateway.piuba.iot:1883"
                  className="font-mono text-sm"
                  {...register('endpoint')}
                />
                {errors.endpoint && (
                  <p className="text-xs text-destructive">{errors.endpoint.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                Cancelar
              </Button>
              <Button type="submit">{isEdit ? 'Salvar alterações' : 'Cadastrar'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
