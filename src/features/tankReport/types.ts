export type {
  ExportJobStatus,
  ExportStatus,
  StartExportResult,
} from '@/features/reportExport/types';

export type TankStatusFilter = 'all' | 'active' | 'inactive';
export type OccupancyFilter = 'all' | 'occupied' | 'idle';

export type TankWarning =
  | 'sem_biometria'
  | 'capacidade_invalida'
  | 'varios_lotes'
  | 'inativo_com_lote'
  | 'populacao_inconsistente';

/** Estado do formulário; arrays vazios = sem filtro. */
export type TankFilters = {
  cutoffDate: string;
  status: TankStatusFilter;
  occupancy: OccupancyFilter;
  tankIds: string[];
  tankTypeIds: string[];
};

export type Summary = {
  tanks: number;
  activeTanks: number;
  inactiveTanks: number;
  occupiedTanks: number;
  idleTanks: number;
  occupancyPct: number | null;
  totalCapacityM3: number;
  occupiedCapacityM3: number;
  volumeOccupancyPct: number | null;
  totalAlive: number;
  totalBiomassKg: number;
  avgDensityKgM3: number | null;
  tanksWithoutBiometry: number;
  inactiveWithBatch: number;
};

export type TankRow = {
  tankId: string;
  name: string;
  typeName: string | null;
  location: string | null;
  status: 'active' | 'inactive';
  capacityLiters: number;
  capacityM3: number;
  occupied: boolean;
  activeBatches: number;
  batchNames: string[];
  alive: number;
  avgWeightG: number | null;
  biomassKg: number | null;
  densityKgM3: number | null;
  fishPerM3: number | null;
  oldestBatchDays: number;
  warnings: TankWarning[];
};

export type TankPreview = {
  /** Eco em snake_case: não dependa dele, use o estado do formulário. */
  filters: Record<string, unknown>;
  summary: Summary;
  tanks: TankRow[];
};
