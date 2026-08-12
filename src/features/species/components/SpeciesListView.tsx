'use client';

import { useCallback, useState } from 'react';
import type { Species, SpeciesListResponse } from '../types';
import { SpeciesTable } from './SpeciesTable';
import { SpeciesDialog, type SpeciesDialogMode } from './SpeciesDialog';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { SPECIES_WRITE_ROLES } from '../utils/permissions';
import { ListHeader, Pagination, SearchField } from '@/shared/components/list';
import {
  ListEmptyState,
  ListErrorState,
  ListLoadingState,
} from '@/shared/components/states/ListStates';
import { Card, CardContent } from '@/shared/components/ui/Card';
import { Fish } from 'lucide-react';

export type SpeciesListViewProps = {
  page: number;
  setPage: (next: number) => void;
  search: string;
  setSearch: (next: string) => void;
  data: SpeciesListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  handleDelete: (id: string, name: string) => void;
  isDeleting: boolean;
};

export function SpeciesListView({
  page,
  setPage,
  search,
  setSearch,
  data,
  isLoading,
  error,
  handleDelete,
  isDeleting,
}: Readonly<SpeciesListViewProps>) {
  const { canAccess } = useAuthContext();
  const canWrite = canAccess(SPECIES_WRITE_ROLES);
  const species = data?.species ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<SpeciesDialogMode>('create');
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const openSpeciesDialog = useCallback(
    (mode: SpeciesDialogMode, item: Species | null = null) => {
      setDialogMode(mode);
      setSelectedSpecies(item);
      setDialogOpen(true);
    },
    [],
  );

  const renderContent = () => {
    if (isLoading) return <ListLoadingState />;
    if (error)
      return (
        <ListErrorState
          title="Erro ao carregar espécies"
          message="Não foi possível carregar as espécies. Tente novamente."
        />
      );
    if (!species.length) return <ListEmptyState title="Nenhuma espécie encontrada." />;

    return (
      <>
        <SpeciesTable
          species={species}
          onEdit={(item) => openSpeciesDialog('edit', item)}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
        {data && data.total > data.limit && (
          <Pagination
            page={page}
            limit={data.limit}
            total={data.total}
            itemLabelPlural="espécies"
            onPageChange={setPage}
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <ListHeader
        icon={<Fish className="h-8 w-8 text-[#0EA5A4]" />}
        title="Espécies"
        subtitle="Catálogo de espécies e parâmetros biológicos de referência"
        dialogOpen={canWrite}
        dialogLabel="Nova espécie"
        setDialogOpen={() => openSpeciesDialog('create')}
      />

      {canWrite && (
        <SpeciesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={() => setDialogOpen(false)}
          mode={dialogMode}
          species={selectedSpecies}
        />
      )}

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <SearchField
            search={search}
            setSearch={setSearch}
            setCurrentPage={setPage}
            placeholder="Buscar por nome..."
          />
        </CardContent>
      </Card>

      <main className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
