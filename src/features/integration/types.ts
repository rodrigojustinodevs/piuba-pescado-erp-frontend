/**
 * Tipos relacionados à entidade Integration (integrações IoT: gateways, sensores, APIs)
 */

import type { DataTableAction } from '@/shared/components/Table';

export type IntegrationType = 'gateway' | 'sensor' | 'controller' | 'webhook' | 'external_api';

export type IntegrationStatus = 'connected' | 'error' | 'disconnected' | 'pending';

export type IntegrationProtocol = 'MQTT' | 'HTTP' | 'Modbus' | 'LoRaWAN';

export interface Integration {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: IntegrationType;
  protocol: IntegrationProtocol;
  endpoint: string;
  deviceCount: number;
  status: IntegrationStatus;
  lastSyncAt: string | null;
}

export type CreateIntegrationData = Omit<Integration, 'id' | 'status' | 'lastSyncAt' | 'deviceCount'>;

export type UpdateIntegrationData = Partial<CreateIntegrationData> & { id: string };

export type IntegrationDialogMode = 'create' | 'edit' | 'view';

export type IntegrationTypeFilter = 'all' | IntegrationType;

export type IntegrationStatusFilter = 'all' | IntegrationStatus;

export interface IntegrationTableProps {
  integrations: Integration[];
  rowActions: (integration: Integration) => DataTableAction[];
}
