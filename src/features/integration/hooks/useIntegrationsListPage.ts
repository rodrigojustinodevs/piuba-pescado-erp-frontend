'use client';

import { useCallback, useMemo, useState } from 'react';
import { MOCK_INTEGRATIONS } from '../data/mockIntegrations';
import type {
  CreateIntegrationData,
  Integration,
  IntegrationStatusFilter,
  IntegrationTypeFilter,
  UpdateIntegrationData,
} from '../types';
import { useListPageState } from '@/shared/hooks/useListPageState';
import { useAlertModal } from '@/shared/components/AlertModal';
import { useToast } from '@/shared/contexts/ToastContext';

const SYNC_DELAY_MS = 800;

function syncIntegration(integration: Integration, now: string): Integration {
  if (integration.status === 'disconnected') return integration;
  return { ...integration, status: 'connected', lastSyncAt: now };
}

function matchesSearch(integration: Integration, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return (
    integration.name.toLowerCase().includes(term) ||
    integration.manufacturer.toLowerCase().includes(term) ||
    integration.model.toLowerCase().includes(term)
  );
}

export function useIntegrationsListPage() {
  const listState = useListPageState<IntegrationStatusFilter>({ initialSortBy: 'name' });
  const { search, setSearch, filter, setFilter } = listState;
  const [typeFilter, setTypeFilter] = useState<IntegrationTypeFilter>('all');
  const [integrations, setIntegrations] = useState<Integration[]>(MOCK_INTEGRATIONS);
  const [isSyncing, setIsSyncing] = useState(false);

  const { showError } = useAlertModal();
  const { showSuccess } = useToast();

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      if (!matchesSearch(integration, search)) return false;
      if (filter !== 'all' && integration.status !== filter) return false;
      if (typeFilter !== 'all' && integration.type !== typeFilter) return false;
      return true;
    });
  }, [integrations, search, filter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: integrations.length,
      connected: integrations.filter((i) => i.status === 'connected').length,
      withErrors: integrations.filter((i) => i.status === 'error').length,
      devices: integrations.reduce((sum, i) => sum + i.deviceCount, 0),
    };
  }, [integrations]);

  const createIntegration = useCallback(
    (data: CreateIntegrationData) => {
      const newIntegration: Integration = {
        ...data,
        id: crypto.randomUUID(),
        deviceCount: 0,
        status: 'pending',
        lastSyncAt: null,
      };
      setIntegrations((prev) => [newIntegration, ...prev]);
      showSuccess('Integração cadastrada com sucesso!');
    },
    [showSuccess],
  );

  const updateIntegration = useCallback(
    (data: UpdateIntegrationData) => {
      setIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === data.id ? { ...integration, ...data } : integration,
        ),
      );
      showSuccess('Integração atualizada com sucesso!');
    },
    [showSuccess],
  );

  const removeIntegration = useCallback(
    (id: string) => {
      setIntegrations((prev) => prev.filter((integration) => integration.id !== id));
      showSuccess('Integração removida com sucesso!');
    },
    [showSuccess],
  );

  const handleDelete = useCallback(
    (id: string, name: string) => {
      showError(
        'Confirmar Remoção',
        `Tem certeza que deseja remover a integração "${name}"? Esta ação não pode ser desfeita.`,
        'Sim, Remover',
        () => removeIntegration(id),
      );
    },
    [showError, removeIntegration],
  );

  const reconnectIntegrations = useCallback(() => {
    const now = new Date().toISOString();
    setIntegrations((prev) => prev.map((integration) => syncIntegration(integration, now)));
    setIsSyncing(false);
    showSuccess('Sincronização concluída com sucesso!');
  }, [showSuccess]);

  const handleSync = useCallback(() => {
    setIsSyncing(true);
    setTimeout(reconnectIntegrations, SYNC_DELAY_MS);
  }, [reconnectIntegrations]);

  return {
    search,
    setSearch,
    filter,
    setFilter,
    typeFilter,
    setTypeFilter,
    filteredIntegrations,
    stats,
    createIntegration,
    updateIntegration,
    handleDelete,
    handleSync,
    isSyncing,
  };
}
