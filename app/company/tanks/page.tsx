"use client";

import { useState } from "react";
import Link from "next/link";
import { useTanks, useDeleteTank, useTankLookups } from "@/features/tank";
import { TankTable } from "@/features/tank/components";
import { useAlertModal } from "@/shared/components/AlertModal";
import { DemoDashboardLayout } from "@/app/_components/DemoDashboardLayout";
import { ListHeader } from "@/app/_components/ListHeader";
import { Pagination } from "@/app/_components/Pagination";
import { SearchField } from "@/app/_components/SearchField";
import { StatusFilterTabs } from "@/app/_components/StatusFilterTabs";
import {
  CircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FilterIcon,
  SpinnerIcon,
} from "@/app/_components/AppIcons";

type FilterType = "all" | "active" | "inactive";

export default function TanksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState("name");
  const { data, isLoading, error } = useTanks({ page, limit: 10, search });
  const deleteTank = useDeleteTank();
  const { showError } = useAlertModal();
  const { tankTypeMap, companyMap } = useTankLookups();

  const handleDelete = (id: string, name: string) => {
    showError(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o tanque "${name}"? Esta ação não pode ser desfeita.`,
      "Sim, Excluir",
      () => {
        deleteTank.mutate(id);
      }
    );
  };

  const filteredTanks =
    data?.tanks.filter((tank) => {
      if (filter === "active") return tank.status === "active";
      if (filter === "inactive") return tank.status !== "active";
      return true;
    }) ?? [];

  const totalFiltered = filteredTanks.length;
  const inactiveCount = data?.tanks.filter((t) => t.status !== "active").length ?? 0;

  return (
    <DemoDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <ListHeader
          icon={<CircleIcon className="h-8 w-8 text-[#0EA5A4]" />}
          title="Tanques"
          subtitle="Gerencie e acompanhe os tanques cadastrados"
          ctaHref="/company/tanks/create"
          ctaLabel="Novo Tanque"
        />

        {/* Search, Filters and Sort - single line */}
        <div className="flex flex-wrap items-center gap-3">
          <SearchField
            value={search}
            placeholder="Buscar tanque..."
            onChange={(next) => {
              setSearch(next);
              setPage(1);
            }}
          />
          <StatusFilterTabs
            filter={filter}
            onChange={setFilter}
            inactiveCount={inactiveCount}
            labels={{ all: "Todas", active: "Ativos", inactive: "Inativos" }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-600">Ordenar por:</span>
            <button
              onClick={() => setSortBy("name")}
              aria-label={`Ordenar por: ${sortBy}`}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0F172A] hover:bg-slate-50 transition-colors"
            >
              <span>Nome</span>
              <ChevronDownIcon className="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Results Count and Advanced Filters */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            {totalFiltered} {totalFiltered === 1 ? "tanque encontrado" : "tanques encontrados"}
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
              Erro ao carregar tanques. Tente novamente.
            </div>
          ) : !filteredTanks.length ? (
            <div className="p-8 text-center text-slate-500">
              Nenhum tanque encontrado.
            </div>
          ) : (
            <>
              <TankTable
                tanks={filteredTanks}
                onDelete={handleDelete}
                isDeleting={deleteTank.isPending}
                tankTypeMap={tankTypeMap}
                companyMap={companyMap}
              />

              {/* Pagination */}
              {data && data.total > data.limit && (
                <Pagination
                  page={page}
                  limit={data.limit}
                  total={data.total}
                  itemLabelPlural="tanques"
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

