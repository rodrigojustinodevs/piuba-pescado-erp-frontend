export type ExportJobStatus = 'pending' | 'processing' | 'done' | 'failed';

export type ExportType =
  | 'production'
  | 'commercial'
  | 'financial'
  | 'inventory'
  | 'tank'
  | 'data-export';

export type ExportStatus = {
  id: string;
  type: ExportType;
  createdAt: string;
  status: ExportJobStatus;
  rows: number | null;
  durationMs: number | null;
  error: string | null;
  downloadUrl: string | null;
};

export type StartExportResult = { exportId: string; status: ExportJobStatus };
