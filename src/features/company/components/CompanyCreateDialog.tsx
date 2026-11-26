import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCompany, useUpdateCompany } from '@/features/company';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { Loader2 } from 'lucide-react';
import { CompanyDetailsDialog } from './CompanyDetailsDialog';
import { createCompanySchema, type CreateCompanyFormData } from '../schemas';
import type { Company, CreateCompanyData, UpdateCompanyData } from '../types';
import { STATES_LIST } from '@/shared/types';

export type CompanyDialogMode = 'create' | 'edit' | 'view';

interface CompanyCreateDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSuccess?: () => void;
  readonly mode?: CompanyDialogMode;
  readonly company?: Company | null;
  /** Chamado pelo botão "Editar" da visualização (troca o modo para 'edit'). */
  readonly onEdit?: () => void;
}

const initialForm: CreateCompanyFormData = {
  name: '',
  cnpj: '',
  email: '',
  phone: '',
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  active: true,
};

function companyToForm(c: Company): CreateCompanyFormData {
  return {
    name: c.name,
    cnpj: c.cnpj,
    email: c.email,
    phone: c.phone,
    address: {
      street: c.address.street,
      number: c.address.number,
      complement: c.address.complement ?? '',
      neighborhood: c.address.neighborhood,
      city: c.address.city,
      state: c.address.state,
      zipCode: c.address.zipCode,
    },
    active: c.status === 'active',
  };
}

export function CompanyCreateDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  company = null,
  onEdit,
}: CompanyCreateDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: initialForm,
  });

  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const saving = createCompany.isPending || updateCompany.isPending;

  useEffect(() => {
    if (open) {
      reset(company ? companyToForm(company) : initialForm);
    }
  }, [open, company, reset]);

  function onSubmit(data: CreateCompanyFormData) {
    if (isView) return;

    if (isEdit) {
      if (!company?.id) return;
      const payload: UpdateCompanyData = { id: company.id, ...data };
      updateCompany.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
    } else {
      createCompany.mutate(data as CreateCompanyData, {
        onSuccess: () => {
          onOpenChange(false);
          onSuccess?.();
        },
      });
    }
  }

  function handleClose(value: boolean) {
    if (!value) {
      reset(initialForm);
    }
    onOpenChange(value);
  }

  if (isView) {
    return (
      <CompanyDetailsDialog
        company={company}
        open={open}
        onOpenChange={onOpenChange}
        onEdit={onEdit}
      />
    );
  }

  let title: string;
  if (isEdit) {
    title = 'Editar Empresa';
  } else {
    title = 'Nova Empresa';
  }

  let description: string;
  if (isEdit) {
    description = 'Atualize os dados da empresa abaixo.';
  } else {
    description = 'Preencha os dados para cadastrar uma nova empresa ou fazenda.';
  }

  // ---------- Create / Edit mode ----------
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados básicos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Dados da empresa</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Razão social" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input id="cnpj" placeholder="00.000.000/0000-00" {...register('cnpj')} />
                {errors.cnpj && <p className="text-xs text-destructive">{errors.cnpj.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? 'active' : 'inactive'}
                      onValueChange={(value: 'active' | 'inactive') => {
                        const nextValue = value === 'active';
                        field.onChange(nextValue);
                        setValue('active', nextValue, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contato@empresa.com.br"
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" placeholder="(00) 00000-0000" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Endereço</h3>
            <div className="grid gap-4 sm:grid-cols-6">
              <div className="space-y-2 sm:col-span-4">
                <Label htmlFor="street">Logradouro</Label>
                <Input id="street" placeholder="Rua, Avenida..." {...register('address.street')} />
                {errors.address?.street && (
                  <p className="text-xs text-destructive">{errors.address.street.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="number">Número</Label>
                <Input id="number" placeholder="Nº" {...register('address.number')} />
                {errors.address?.number && (
                  <p className="text-xs text-destructive">{errors.address.number.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Sala, Galpão..."
                  {...register('address.complement')}
                />
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  placeholder="Bairro"
                  {...register('address.neighborhood')}
                />
                {errors.address?.neighborhood && (
                  <p className="text-xs text-destructive">{errors.address.neighborhood.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" placeholder="Cidade" {...register('address.city')} />
                {errors.address?.city && (
                  <p className="text-xs text-destructive">{errors.address.city.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-1">
                <Label htmlFor="state">UF</Label>
                <Controller
                  name="address.state"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES_LIST.map((uf) => (
                          <SelectItem key={uf} value={uf}>
                            {uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.address?.state && (
                  <p className="text-xs text-destructive">{errors.address.state.message}</p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input id="zipCode" placeholder="00000-000" {...register('address.zipCode')} />
                {errors.address?.zipCode && (
                  <p className="text-xs text-destructive">{errors.address.zipCode.message}</p>
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
