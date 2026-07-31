'use client';

import { useCallback, useState } from 'react';
import type { Company, CompanyListResponse } from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { ListHeader, Pagination, SearchField, StatusFilterTabs } from '@/shared/components/list';

import { Badge } from '@/shared/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Building, Calendar, Mail, MapPin, Phone, Eye, Loader2, Trash, Pencil } from 'lucide-react';
import { CompanyCreateDialog, CompanyDialogMode } from './CompanyCreateDialog';

export type CompanyFilter = 'all' | 'active' | 'inactive';

const statusConfig: Record<
  Company['status'],
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  active: { label: 'Ativa', variant: 'default' },
  inactive: { label: 'Inativa', variant: 'secondary' },
};

export type CompaniesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  filter: CompanyFilter;
  setFilter: (next: CompanyFilter) => void;
  data: CompanyListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  filteredCompanies: Company[];
  stats: {
    total: number;
    inactive: number;
  };
  handleDelete: (id: string, name: string) => void;
};

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

const formatCity = (c: Company) => [c.address.city, c.address.state].filter(Boolean).join('/');

const TABLE_COLUMNS: Array<DataTableColumn<Company>> = [
  {
    id: 'name',
    header: 'Nome',
    cell: (c) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
          {c.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium">{c.name}</p>
          <p className="truncate text-xs text-muted-foreground md:hidden">{c.cnpj}</p>
        </div>
      </div>
    ),
  },
  {
    id: 'cnpj',
    header: 'CNPJ',
    cellClassName: 'hidden font-mono text-sm md:table-cell',
    headerClassName: 'hidden md:table-cell',
    cell: (c) => <div className="hidden font-mono text-sm md:table-cell">{c.cnpj}</div>,
  },
  {
    id: 'contact',
    header: 'Contato',
    cellClassName: 'hidden text-sm md:table-cell',
    headerClassName: 'hidden lg:table-cell',
    cell: (c) => (
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate">{c.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{c.phone}</span>
        </div>
      </div>
    ),
  },
  {
    id: 'address',
    header: 'Endereço',
    cellClassName: 'hidden md:table-cell',
    headerClassName: 'hidden xl:table-cell',
    cell: (c) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-3 w-3 shrink-0" /> <span className="truncate">{formatCity(c)}</span>
      </div>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (c) => {
      const sc = statusConfig[c.status];
      return <Badge variant={sc.variant}>{sc.label}</Badge>;
    },
  },
  {
    id: 'createdAt',
    header: 'Criado em',
    cellClassName: 'hidden text-sm text-muted-foreground sm:table-cell',
    headerClassName: 'hidden sm:table-cell',
    cell: (c) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar className="h-3 w-3 shrink-0" />{' '}
        <span className="truncate">{formatDate(c.createdAt)}</span>
      </div>
    ),
  },
];

export function CompaniesListView({
  page,
  setPage,
  search,
  setSearch,
  filter,
  setFilter,
  data,
  isLoading,
  error,
  filteredCompanies,
  stats,
  handleDelete,
}: Readonly<CompaniesListViewProps>) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<CompanyDialogMode>('create');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const openCompanyDialog = useCallback(
    (mode: CompanyDialogMode, company: Company | null = null) => {
      setDialogMode(mode);
      setSelectedCompany(company);
      setDialogOpen(true);
    },
    [],
  );

  const getRowActions = useCallback(
    (company: Company) => [
      {
        label: 'Ver detalhes',
        onClick: () => openCompanyDialog('view', company),
        icon: <Eye className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        onClick: () => openCompanyDialog('edit', company),
        icon: <Pencil className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(company.id, company.name),
        variant: 'danger' as const,
        icon: <Trash className="h-4 w-4" />,
      },
    ],
    [handleDelete, openCompanyDialog],
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center flex justify-center items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center text-red-600">
          Erro ao carregar empresas. Tente novamente.
        </div>
      );
    }

    if (!filteredCompanies.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma empresa encontrada.</div>;
    }

    return (
      <>
        <DataTable
          data={filteredCompanies}
          columns={TABLE_COLUMNS}
          getRowId={(c) => c.id}
          rowActions={getRowActions}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="empresas"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Building className="h-8 w-8 text-[#0EA5A4]" />}
        title="Empresas / Fazendas"
        subtitle="Gerencie e acompanhe as unidades aquícolas cadastradas"
        dialogOpen={true}
        setDialogOpen={() => openCompanyDialog('create')}
      />
      <CompanyCreateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
        }}
        mode={dialogMode}
        company={selectedCompany}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ativas</CardTitle>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.companies.filter((c) => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inativas / Suspensas
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {data?.companies.filter((c) => c.status !== 'active').length}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <SearchField
            search={search}
            setSearch={setSearch}
            setCurrentPage={setPage}
            placeholder="Buscar por nome, CNPJ ou e-mail..."
          />

          <StatusFilterTabs
            filter={filter}
            onChange={setFilter}
            inactiveCount={stats.inactive}
            labels={{ all: 'Todas', active: 'Ativas', inactive: 'Inativas' }}
          />
        </CardContent>
      </Card>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderTableContent()}
      </main>
    </div>
  );
}
