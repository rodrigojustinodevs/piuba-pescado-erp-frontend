/**
 * Barrel export para o módulo de Batch (Lotes)
 */

export type {
  Batch,
  BatchTank,
  BatchListResponse,
  ApiBatchListResponse,
  ApiBatchResponse,
  BatchStatus,
  BatchStatusFilter,
  BatchCultivation,
  CreateBatchData,
  UpdateBatchData,
  BatchDistributionItem,
  BatchDistributionPayload,
  BatchesListViewProps,
} from './types';

export { batchService } from './services/batchService';

export {
  useBatches,
  useBatch,
  useBatchesListPage,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
  useDistributeBatch,
} from './hooks';
export type { UseBatchesParams } from './hooks';

export {
  BatchSelectField,
  BatchStatusBadge,
  BatchTable,
  BatchesListView,
  BatchDetailView,
  BatchPageShell,
  BatchForm,
  BatchDistributionForm,
  BatchCreateDialog,
} from './components';
export type { BatchFormProps, BatchDetailViewProps } from './components';

export {
  createBatchSchema,
  updateBatchSchema,
  batchDistributionSchema,
  isBatchDistributionData,
} from './schemas';
export type {
  CreateBatchFormData,
  UpdateBatchFormData,
  BatchDistributionFormData,
} from './schemas';
