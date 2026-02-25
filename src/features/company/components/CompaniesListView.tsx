'use client';

import { useCallback } from 'react';
import type { Company, CompanyListResponse } from '../types';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import {
  ListHeader,
  Pagination,
  SearchField,
  SortButton,
  StatusFilterTabs,
} from '@/shared/components/list';
import {
  ChevronRightIcon,
  CircleIcon,
  EyeIcon,
  FilterIcon,
  PencilIcon,
  SpinnerIcon,
  TrashIcon,
} from '@/shared/components/icons/AppIcons';

type CompanyFilter = 'all' | 'active' | 'inactive';

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

const TABLE_COLUMNS: Array<DataTableColumn<Company>> = [
  {
    id: 'name',
    header: 'Nome',
    cell: (c) => <div className="text-sm font-medium text-[#0F172A]">{c.name}</div>,
  },
  {
    id: 'cnpj',
    header: 'CNPJ',
    cell: (c) => <div className="text-sm text-slate-600">{c.cnpj}</div>,
  },
  {
    id: 'email',
    header: 'E-mail',
    cell: (c) => <div className="text-sm text-slate-600">{c.email}</div>,
  },
  {
    id: 'status',
    header: 'Status',
    cell: (c) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {c.active ? 'Ativa' : 'Inativa'}
      </span>
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
  const getRowActions = useCallback(
    (company: Company) => [
      {
        label: 'Ver detalhes',
        href: `/admin/companies/${company.id}`,
        icon: <EyeIcon className="h-4 w-4" />,
      },
      {
        label: 'Editar',
        href: `/admin/companies/${company.id}/edit`,
        icon: <PencilIcon className="h-4 w-4" />,
      },
      {
        label: 'Excluir',
        onClick: () => handleDelete(company.id, company.name),
        variant: 'danger' as const,
        icon: <TrashIcon className="h-4 w-4" />,
      },
    ],
    [handleDelete],
  );

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center flex justify-center items-center gap-2 text-slate-500">
          <SpinnerIcon className="w-5 h-5 animate-spin" />
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
        icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
        title="Empresas"
        subtitle="Gerencie e acompanhe as unidades aquícolas cadastradas"
        ctaHref="/admin/companies/create"
        ctaLabel="Nova Empresa"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar empresa..." onChange={setSearch} />

        <StatusFilterTabs
          filter={filter}
          onChange={setFilter}
          inactiveCount={stats.inactive}
          labels={{ all: 'Todas', active: 'Ativas', inactive: 'Inativas' }}
        />

        <SortButton />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {stats.total} {stats.total === 1 ? 'empresa encontrada' : 'empresas encontradas'}
        </p>
        <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
          <FilterIcon className="h-4 w-4" />
          Filtros avançados
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </section>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderTableContent()}
      </main>
    </div>
  );
}
