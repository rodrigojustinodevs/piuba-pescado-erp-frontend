'use client';

import type { Biometry, BiometryListResponse } from '../types';
import { BiometryTable } from './BiometryTable';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';

export type BiometriesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: BiometryListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  biometries: Biometry[];
};

export function BiometriesListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  biometries,
}: Readonly<BiometriesListViewProps>) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <SpinnerIcon className="w-5 h-5 animate-spin" />
            <span>Carregando...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return <div className="p-8 text-center text-red-600">Erro ao carregar biometrias.</div>;
    }

    if (!biometries.length) {
      return <div className="p-8 text-center text-slate-500">Nenhuma biometria encontrada.</div>;
    }

    return (
      <>
        <BiometryTable biometries={biometries} />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="biometrias"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={
          <svg
            className="h-8 w-8 text-[#0EA5A4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        }
        title="Biometrias"
        subtitle="Acompanhe as biometrias por lote"
        ctaHref="/company/biometries/create"
        ctaLabel="Nova Biometria"
      />

      <section className="flex flex-wrap items-center gap-3">
        <SearchField value={search} placeholder="Buscar por lote..." onChange={setSearch} />
      </section>

      <section className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.total ?? 0} {data?.total === 1 ? 'biometria encontrada' : 'biometrias encontradas'}
        </p>
      </section>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
