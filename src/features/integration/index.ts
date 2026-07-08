/**
 * Barrel export para o módulo de Integration (integrações IoT)
 */

// Types
export type {
  Integration,
  CreateIntegrationData,
  UpdateIntegrationData,
  IntegrationType,
  IntegrationStatus,
  IntegrationProtocol,
  IntegrationDialogMode,
  IntegrationTypeFilter,
  IntegrationStatusFilter,
} from './types';

// Schemas
export { createIntegrationSchema } from './schemas';
export type { CreateIntegrationFormData } from './schemas';

// Hooks
export { useIntegrationsListPage } from './hooks';

// Components
export { IntegrationTable, IntegrationDialog, IntegrationsListView } from './components';
