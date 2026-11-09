export type {
  ExportJobStatus,
  ExportStatus,
  StartExportResult,
} from '@/features/reportExport/types';

export type SituationFilter = 'all' | 'ok' | 'below_minimum' | 'zero';
export type ItemSituation = Exclude<SituationFilter, 'all'>;

export type Category =
  | 'feed'
  | 'medication'
  | 'fertilizer'
  | 'probiotic'
  | 'equipment'
  | 'packaging'
  | 'finished_product'
  | 'other';

export type StockType = 'warehouse' | 'cold_room' | 'silo' | 'storage' | 'field';

export type StockWarning = 'saldo_negativo' | 'sem_preco' | 'unidade_divergente';

/** Estado do formulário; strings vazias / arrays vazios = sem filtro. */
export type InventoryFilters = {
  cutoffDate: string;
  periodStart: string;
  periodEnd: string;
  situation: SituationFilter;
  categories: Category[];
  stockTypes: StockType[];
  supplyIds: string[];
  includeInactive: boolean;
};

export type StartExportInput = InventoryFilters & { includeDetails: boolean };

export type Summary = {
  items: number;
  totalValue: number;
  itemsBelowMinimum: number;
  itemsZero: number;
  itemsNegative: number;
  itemsWithoutPrice: number;
  replenishmentValue: number;
  windowDays: number;
};

export type StockItem = {
  stockId: string;
  code: string | null;
  name: string;
  category: Category | null;
  stockType: StockType | null;
  location: string | null;
  unit: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  totalValue: number;
  situation: ItemSituation;
  shortage: number;
  replenishmentValue: number;
  consumption: number | null;
  avgDailyConsumption: number | null;
  coverageDays: number | null;
  warnings: StockWarning[];
};

export type InventoryPreview = {
  /** Eco em snake_case: não dependa dele, use o estado do formulário. */
  filters: Record<string, unknown>;
  summary: Summary;
  items: StockItem[];
};
