"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompanies, useDeleteCompany } from "@/features/company";
import { useAlertModal } from "@/shared/components/AlertModal";
import type { Company } from "@/features/company";
import { DataTable, type DataTableColumn } from "@/shared/components/Table";
import { DemoDashboardLayout } from "@/app/_components/DemoDashboardLayout";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  PencilIcon,
  SearchIcon,
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Fish Icon */}
            <div className="flex h-10 w-10 items-center justify-center">
              <CircleIcon className="h-8 w-8 text-[#0EA5A4]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0F172A]">Empresas</h1>
              <p className="mt-1 text-base text-slate-500">
                Gerencie e acompanhe as unidades aquícolas cadastradas
              </p>
            </div>
          </div>
          <Link
            href="/admin/companies/new"
            className="flex items-center gap-2 rounded-lg bg-[#0EA5A4] px-4 py-2 text-sm font-medium text-white hover:bg-[#0F766E] transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Nova Empresa
          </Link>
        </div>

        {/* Search, Filters and Sort - single line */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-[#0EA5A4]" />
            </div>
            <input
              type="text"
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-[#0EA5A4] bg-white pl-10 pr-4 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0EA5A4] focus:outline-none focus:ring-1 focus:ring-[#0EA5A4]"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "all"
                  ? "bg-[#0EA5A4] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "active"
                  ? "bg-[#0EA5A4] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === "inactive"
                  ? "bg-[#0EA5A4] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Inativas
              {inactiveCount > 0 && (
                <span
                  className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    filter === "inactive"
                      ? "bg-white/20 text-white"
                      : "bg-[#0EA5A4] text-white"
                  }`}
                >
                  {inactiveCount}
                </span>
              )}
            </button>
          </div>
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
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Mostrando {((page - 1) * data.limit) + 1}-{Math.min(page * data.limit, data.total)} de {data.total} empresas
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Primeira página"
                    >
                      <DoubleChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Página anterior"
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(3, Math.ceil(data.total / data.limit)) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            page === pageNum
                              ? "bg-[#0EA5A4] text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page * data.limit >= data.total}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Próxima página"
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(Math.ceil(data.total / data.limit))}
                      disabled={page * data.limit >= data.total}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Última página"
                    >
                      <DoubleChevronRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DemoDashboardLayout>
  );
}

