"use client";

import { useState } from "react";
import { useCompanies, useDeleteCompany } from "@/features/company";
import { useAlertModal } from "@/shared/components/AlertModal";
import type { Company } from "@/features/company";
import { DataTable, type DataTableColumn } from "@/shared/components/Table";
import { DemoDashboardLayout } from "@/app/_components/DemoDashboardLayout";
import { ListHeader } from "@/app/_components/ListHeader";
import { Pagination } from "@/app/_components/Pagination";
import { SearchField } from "@/app/_components/SearchField";
import { StatusFilterTabs } from "@/app/_components/StatusFilterTabs";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleIcon,
  EyeIcon,
  FilterIcon,
  PencilIcon,
  SpinnerIcon,
  TrashIcon,
} from "@/app/_components/AppIcons";

type FilterType = "all" | "active" | "inactive";

export default function CompaniesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState("name");
  const { data, isLoading, error } = useCompanies({ page, limit: 6, search });
  const deleteCompany = useDeleteCompany();
  const { showError } = useAlertModal();

  const handleDelete = (id: string, name: string) => {
    showError(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir a empresa "${name}"? Esta ação não pode ser desfeita.`,
      "Sim, Excluir",
      () => {
        deleteCompany.mutate(id);
      }
    );
  };

  // Filter companies based on active filter
  const filteredCompanies = data?.companies.filter((company: Company) => {
    if (filter === "active") return company.active;
    if (filter === "inactive") return !company.active;
    return true;
  }) || [];

  const totalFiltered = filteredCompanies.length;
  const inactiveCount = data?.companies.filter((c: Company) => !c.active).length ?? 0;

  const columns: Array<DataTableColumn<Company>> = [
    {
      id: "name",
      header: "Nome",
      cell: (company) => (
        <div className="text-sm font-medium text-[#0F172A]">{company.name}</div>
      ),
    },
    {
      id: "cnpj",
      header: "CNPJ",
      cell: (company) => <div className="text-sm text-slate-600">{company.cnpj}</div>,
    },
    {
      id: "email",
      header: "E-mail",
      cell: (company) => <div className="text-sm text-slate-600">{company.email}</div>,
    },
    {
      id: "status",
      header: "Status",
      cell: (company) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            company.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {company.active ? "Ativa" : "Inativa"}
        </span>
      ),
    },
  ];

  return (
    <DemoDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Empresas"
          subtitle="Gerencie e acompanhe as unidades aquícolas cadastradas"
          ctaHref="/admin/companies/new"
          ctaLabel="Nova Empresa"
        />

        {/* Search, Filters and Sort - single line */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar empresa..."
            onChange={(next) => {
              setSearch(next);
              setPage(1);
            }}
          />
          <StatusFilterTabs
            filter={filter}
            onChange={setFilter}
            inactiveCount={inactiveCount}
            labels={{ all: "Todas", active: "Ativas", inactive: "Inativas" }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-600">Ordenar por:</span>
            <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors">
              <span>Nome</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Results Count and Advanced Filters */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {totalFiltered} {totalFiltered === 1 ? "empresa encontrada" : "empresas encontradas"}
          </p>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <FilterIcon className="h-4 w-4" />
            Filtros avançados
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <SpinnerIcon className="w-5 h-5 animate-spin" />
                <span>Carregando...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Erro ao carregar empresas. Tente novamente.
            </div>
          ) : !filteredCompanies.length ? (
            <div className="p-8 text-center text-slate-500">
              Nenhuma empresa encontrada.
            </div>
          ) : (
            <>
              <DataTable
                data={filteredCompanies}
                columns={columns}
                getRowId={(company) => company.id}
                rowActions={(company) => [
                  {
                    label: "Ver detalhes",
                    href: `/admin/companies/${company.id}`,
                    icon: <EyeIcon className="h-4 w-4" />,
                  },
                  {
                    label: "Editar",
                    href: `/admin/companies/${company.id}/edit`,
                    icon: <PencilIcon className="h-4 w-4" />,
                  },
                  {
                    label: "Excluir",
                    onClick: () => handleDelete(company.id, company.name),
                    variant: "danger",
                    icon: <TrashIcon className="h-4 w-4" />,
                  },
                ]}
              />

              {/* Pagination */}
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
          )}
        </div>
      </div>
    </DemoDashboardLayout>
  );
}

