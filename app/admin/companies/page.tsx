'use client';

import { useMemo, useCallback } from 'react';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useCompanies, useDeleteCompany, type Company } from '@/features/company';
import { useAlertModal } from '@/shared/components/AlertModal';
import { DataTable, type DataTableColumn } from '@/shared/components/Table';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';
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

// ============================================================================
// 1. DEFINIÇÃO ESTÁTICA DE COLUNAS (Separado da Lógica de View)
// ============================================================================

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

// ============================================================================
// 2. COMPONENTE PRINCIPAL
// ============================================================================

export default function CompaniesPage() {
  // --- Hooks & Estado ---
  const listState = useListPageState({ initialSortBy: 'name' });
  const { page, setPage, search, setSearch, filter, setFilter } = listState;

  const { data, isLoading, error } = useCompanies({ page, limit: 6, search });
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();

  // --- Lógica de Negócio (Memoizada) ---
  const filteredCompanies = useMemo(() => {
    const list = data?.companies ?? [];
    if (filter === 'active') return list.filter((c) => c.active);
    if (filter === 'inactive') return list.filter((c) => !c.active);
    return list;
  }, [data?.companies, filter]);

  const stats = useMemo(
    () => ({
      total: filteredCompanies.length,
      inactive: data?.companies.filter((c) => !c.active).length ?? 0,
    }),
    [filteredCompanies.length, data?.companies],
  );

  // --- Handlers ---
  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Exclusão',
        `Tem certeza que deseja excluir a empresa "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Excluir',
        () => deleteCompany.mutate(id),
      );
    },
    [showError, deleteCompany],
  );

  // Definição das ações da tabela (Memoizada para evitar re-criação a cada render)
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

  // --- Render Helpers ---
  const renderLoading = () => (
    <div className="p-8 text-center flex justify-center items-center gap-2 text-slate-500">
      <SpinnerIcon className="w-5 h-5 animate-spin" />
      <span>Carregando...</span>
    </div>
  );

  const renderError = () => (
    <div className="p-8 text-center text-red-600">Erro ao carregar empresas. Tente novamente.</div>
  );

  const renderEmpty = () => (
    <div className="p-8 text-center text-slate-500">Nenhuma empresa encontrada.</div>
  );

  // --- Decisão do que renderizar na tabela ---
  let tableContent;
  if (isLoading) tableContent = renderLoading();
  else if (error) tableContent = renderError();
  else if (!filteredCompanies.length) tableContent = renderEmpty();
  else {
    tableContent = (
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
  }

  // --- Render Final ---
  return (
    <DashboardLayout user={demoUser}>
      <div className="space-y-6">
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Empresas"
          subtitle="Gerencie e acompanhe as unidades aquícolas cadastradas"
          ctaHref="/admin/companies/create"
          ctaLabel="Nova Empresa"
        />

        {/* Toolbar Section */}
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

        {/* Info & Filters Section */}
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

        {/* Main Content Area */}
        <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {tableContent}
        </main>
      </div>
    </DashboardLayout>
  );
}
