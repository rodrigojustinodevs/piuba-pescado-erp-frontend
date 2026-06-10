import type { ApiListResponse, ApiResponse } from '@/shared/types/api';

// ─── Domain labels ────────────────────────────────────────────────────────────

export type HarvestType = 'total' | 'partial' | 'selective' | 'emergency';
export type HarvestStatus = 'completed' | 'scheduled' | 'cancelled';
export type HarvestDestination = 'wholesale' | 'retail' | 'processing_plant' | 'other';

export const HARVEST_TYPE_LABELS: Record<HarvestType, string> = {
  total: 'Total',
  partial: 'Parcial',
  selective: 'Seletiva',
  emergency: 'Emergencial',
};

export const HARVEST_STATUS_LABELS: Record<HarvestStatus, string> = {
  completed: 'Concluída',
  scheduled: 'Agendada',
  cancelled: 'Cancelada',
};

export const HARVEST_DESTINATION_LABELS: Record<HarvestDestination, string> = {
  wholesale: 'Atacado',
  retail: 'Varejo',
  processing_plant: 'Frigorífico',
  other: 'Outro',
};

export interface SizeClassification {
  class: string;
  quantity: number;
  averageWeight: number;
  pricePerKg: number;
}

export interface ApiSizeClassification {
  class: string;
  quantity: number;
  averageWeight?: number;
  average_weight?: number;
  pricePerKg?: number;
  price_per_kg?: number;
}

export interface Harvest {
  id: string;
  batchId: string;
  batchName?: string;
  batch?: { id: string; name: string };
  tankId: string;
  tankName?: string;
  harvestDate: string;
  type?: HarvestType;
  status?: HarvestStatus;
  destination?: HarvestDestination;
  initialPopulation?: number;
  harvestedQuantity: number;
  averageWeight: number;
  sizeClassifications: SizeClassification[];
  clientDestination?: string;
  responsible?: string;
  operationalCost?: number;
  notes?: string;
  createdAt: string | null;
  updatedAt: string | null;
}

// ─── API shapes ───────────────────────────────────────────────────────────────

export interface ApiHarvestItem {
  id: string;
  batch?: { id: string; name: string };
  // camelCase (new backend)
  batchId?: string;
  tankId?: string;
  harvestDate?: string;
  initialPopulation?: number;
  harvestedQuantity?: number;
  averageWeight?: number;
  sizeClassifications?: ApiSizeClassification[];
  clientDestination?: string;
  operationalCost?: number;
  // snake_case (legacy / fallback)
  batch_id?: string;
  tank?: { id: string; name: string };
  tank_id?: string;
  harvest_date?: string;
  initial_population?: number;
  harvested_quantity?: number;
  average_weight?: number;
  size_classifications?: ApiSizeClassification[];
  client_destination?: string;
  operational_cost?: number;
  // shared fields
  type?: HarvestType;
  status?: HarvestStatus;
  destination?: HarvestDestination;
  responsible?: string;
  notes?: string;
  createdAt?: string | null;
  created_at?: string | null;
  updatedAt?: string | null;
  updated_at?: string | null;
}

export type ApiHarvestResponse = ApiResponse<ApiHarvestItem>;
export type ApiHarvestListResponse = ApiListResponse<ApiHarvestItem>;

export interface HarvestListResponse {
  harvests: Harvest[];
  total: number;
  page: number;
  limit: number;
}

export type HarvestDialogMode = 'create' | 'edit' | 'view';

// ─── Create / Update DTOs ─────────────────────────────────────────────────────

export interface CreateHarvestData {
  companyId?: string;
  batchId: string;
  tankId: string;
  harvestDate: string;
  type?: HarvestType;
  status?: HarvestStatus;
  destination?: HarvestDestination;
  initialPopulation?: number;
  harvestedQuantity: number;
  averageWeight: number;
  sizeClassifications?: SizeClassification[];
  clientDestination?: string;
  responsible?: string;
  operationalCost?: number;
  notes?: string;
}

export interface UpdateHarvestData {
  id: string;
  tankId?: string;
  harvestDate?: string;
  type?: HarvestType;
  status?: HarvestStatus;
  destination?: HarvestDestination;
  initialPopulation?: number;
  harvestedQuantity?: number;
  averageWeight?: number;
  sizeClassifications?: SizeClassification[];
  clientDestination?: string;
  responsible?: string;
  operationalCost?: number;
  notes?: string;
}

export interface PatchHarvestPayload extends Omit<UpdateHarvestData, 'id'> {
  id: string;
}
