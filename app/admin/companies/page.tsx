"use client";

import { useState } from "react";
import Link from "next/link";
import { useCompanies, useDeleteCompany } from "@/features/company";
import { DashboardLayout } from "@/shared/components/Layout";
import { useAlertModal } from "@/shared/components/AlertModal";
import type { Company } from "@/features/company";
import { DataTable, type DataTableColumn } from "@/shared/components/Table";

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
    <DashboardLayout
      user={{
        name: "Usuário Demo",
        email: "demo@dev.com",
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Fish Icon */}
            <div className="flex h-10 w-10 items-center justify-center">
              <svg
                className="h-8 w-8 text-[#0EA5A4]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
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
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nova Empresa
          </Link>
        </div>

        {/* Search, Filters and Sort - single line */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-[#0EA5A4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
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
              {data && data.companies.filter((c: Company) => !c.active).length > 0 && (
                <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  filter === "inactive"
                    ? "bg-white/20 text-white"
                    : "bg-[#0EA5A4] text-white"
                }`}>
                  {data.companies.filter((c: Company) => !c.active).length}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-600">Ordenar por:</span>
            <button className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors">
              <span>Nome</span>
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Results Count and Advanced Filters */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {totalFiltered} {totalFiltered === 1 ? "empresa encontrada" : "empresas encontradas"}
          </p>
          <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros avançados
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-500">
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
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
                    icon: (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Editar",
                    href: `/admin/companies/${company.id}/edit`,
                    icon: (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Excluir",
                    onClick: () => handleDelete(company.id, company.name),
                    variant: "danger",
                    icon: (
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    ),
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Página anterior"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setPage(Math.ceil(data.total / data.limit))}
                      disabled={page * data.limit >= data.total}
                      className="p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-slate-100 transition-colors"
                      aria-label="Última página"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 5l7 7-7 7M5 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

