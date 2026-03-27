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
} from './types';

export { batchService } from './services/batchService';

export {
  useBatches,
  useBatch,
  useBatchesListPage,
  useCreateBatch,
  useUpdateBatch,
  useDeleteBatch,
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
} from './components';
export type { BatchFormProps, BatchesListViewProps, BatchDetailViewProps } from './components';

export { createBatchSchema, updateBatchSchema } from './schemas';
export type { CreateBatchFormData, UpdateBatchFormData } from './schemas';
