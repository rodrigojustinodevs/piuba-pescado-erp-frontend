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
  BatchCultivation,
  CreateBatchData,
  UpdateBatchData,
  BatchDistributionItem,
  BatchDistributionPayload,
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
export type { UseBatchesParams, BatchStatusFilter } from './hooks';

export {
  BatchSelectField,
  BatchStatusBadge,
  BatchTable,
  BatchesListView,
  BatchDetailView,
  BatchPageShell,
  BatchForm,
  BatchDistributionForm,
} from './components';
export type { BatchFormProps, BatchesListViewProps, BatchDetailViewProps } from './components';

export { createBatchSchema, updateBatchSchema, batchDistributionSchema } from './schemas';
export type {
  CreateBatchFormData,
  UpdateBatchFormData,
  BatchDistributionFormData,
} from './schemas';
