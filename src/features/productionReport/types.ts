export type ReportStatusFilter = 'all' | 'active' | 'finished';

export type ReportFilters = {
  cutoffDate: string;
  periodStart: string;
  periodEnd: string;
  status: ReportStatusFilter;
  batchIds: string[];
  tankIds: string[];
};

export type StartExportInput = ReportFilters & { includeDetails: boolean };

export type Summary = {
  batches: number;
  activeBatches: number;
  stocked: number;
  alive: number;
  deaths: number;
  deathsPct: number | null;
  survivalPct: number | null;
  biomassKg: number;
  harvestedKg: number;
  feedKg: number;
  fcr: number | null;
  feedCost: number;
  totalCost: number;
  costPerKg: number | null;
  batchesAboveMortalityLimit: number;
  mortalityLimitPct: number;
  feedingsWithoutCost: number;
};

export type BatchWarning =
  | 'sem_povoamento'
  | 'populacao_inconsistente'
  | 'sem_biometria'
  | 'custo_racao_parcial'
  | 'venda_sem_despesca'
  | 'especie_nao_encontrada';

export type BatchRow = {
  batchId: string;
  batchName: string;
  tankName: string;
  speciesName: string | null;
  status: 'active' | 'finished';
  startDate: string;
  endDate: string | null;
  days: number;
  stocked: number;
  transferredIn: number;
  transferredOut: number;
  harvested: number;
  deaths: number;
  alive: number;
  deathsPct: number | null;
  survivalPct: number | null;
  avgWeightG: number | null;
  avgWeightDate: string | null;
  stockingWeightG: number | null;
  gpdGPerDay: number | null;
  biomassKg: number | null;
  stockedBiomassKg: number;
  harvestedKg: number;
  transferredKg: number;
  densityKgM3: number | null;
  feedKg: number;
  fcr: number | null;
  fingerlingCost: number;
  feedCost: number;
  feedUncosted: number;
  fixedCost: number;
  operationalCost: number;
  totalCost: number;
  costPerKg: number | null;
  aboveMortalityLimit: boolean;
  maxFeedingRatePct: number | null;
  warnings: BatchWarning[];
};

export type Mortality = {
  causes: string[];
  severities: string[];
  matrix: Record<string, Record<string, number>>;
  causeTotals: Record<string, number>;
  severityTotals: Record<string, number>;
  total: number;
};

export type GrowthPoint = {
  batchName: string;
  date: string;
  day: number;
  actualG: number;
  expectedG: number | null;
  deviationPct: number | null;
};

export type WeeklyFeeding = {
  batchName: string;
  weekStart: string;
  kg: number;
  avgDailyPctBiomass: number | null;
  maxPct: number | null;
  aboveMax: boolean;
};

/** Atenção: o backend devolve `harvests` em snake_case. */
export type Harvest = {
  id: string;
  batch_id: string;
  batch_name: string;
  harvest_date: string;
  type: 'total' | 'partial' | 'selective' | 'emergency';
  destination:
    | 'wholesale'
    | 'retail'
    | 'processing'
    | 'restaurant'
    | 'live_market'
    | 'internal'
    | null;
  harvested_quantity: number;
  average_weight: number;
  total_weight: number;
  price_per_kg: number;
  total_revenue: number;
  operational_cost: number;
  classifications: {
    class: string;
    quantity: number;
    average_weight: number;
    price_per_kg: number;
  }[];
};

export type ProductionPreview = {
  filters: Record<string, unknown>;
  summary: Summary;
  batches: BatchRow[];
  mortality: Mortality;
  growth: GrowthPoint[];
  weeklyFeeding: WeeklyFeeding[];
  harvests: Harvest[];
};

export type ExportJobStatus = 'pending' | 'processing' | 'done' | 'failed';

export type ExportStatus = {
  id: string;
  type: 'production';
  createdAt: string;
  status: ExportJobStatus;
  rows: number | null;
  durationMs: number | null;
  error: string | null;
  downloadUrl: string | null;
};

export type StartExportResult = { exportId: string; status: ExportJobStatus };
