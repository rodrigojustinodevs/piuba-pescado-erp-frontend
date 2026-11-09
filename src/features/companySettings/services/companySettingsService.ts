import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { fetchCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import type { ExportStatus } from '@/features/reportExport/types';
import type {
  AuditLogPage,
  CompanyAppearancePayload,
  CompanySettings,
  DataOverview,
  ExportableEntity,
  GeneralPayload,
  NotificationPreference,
  NotificationsPayload,
  SecurityPayload,
  SecuritySettings,
  SettingsSection,
  StartDataExportResult,
  UnitsPayload,
  UserAppearancePayload,
} from '../types';

const BASE = '/api/company/settings';

export type AuditLogQuery = { page: number; perPage: number; section: SettingsSection | null };

export const companySettingsService = {
  get: fetchCompanySettings,

  updateGeneral(payload: GeneralPayload): Promise<CompanySettings> {
    return browserHttpClient.put<CompanySettings>(`${BASE}/general`, payload);
  },

  updateUnits(payload: UnitsPayload): Promise<CompanySettings> {
    return browserHttpClient.put<CompanySettings>(`${BASE}/units`, payload);
  },

  getNotifications(): Promise<NotificationPreference[]> {
    return browserHttpClient.get<NotificationPreference[]>(`${BASE}/notifications`);
  },

  updateNotifications(payload: NotificationsPayload): Promise<NotificationPreference[]> {
    return browserHttpClient.put<NotificationPreference[]>(`${BASE}/notifications`, payload);
  },

  getSecurity(): Promise<SecuritySettings> {
    return browserHttpClient.get<SecuritySettings>(`${BASE}/security`);
  },

  updateSecurity(payload: SecurityPayload): Promise<SecuritySettings> {
    return browserHttpClient.put<SecuritySettings>(`${BASE}/security`, payload);
  },

  updateCompanyAppearance(payload: CompanyAppearancePayload): Promise<CompanySettings> {
    return browserHttpClient.put<CompanySettings>(`${BASE}/appearance`, payload);
  },

  updateUserAppearance(payload: UserAppearancePayload): Promise<CompanySettings> {
    return browserHttpClient.put<CompanySettings>(`${BASE}/appearance/me`, payload);
  },

  getDataOverview(): Promise<DataOverview> {
    return browserHttpClient.get<DataOverview>(`${BASE}/data`);
  },

  /** Vazio = todos os módulos. A resposta traz `id` (e não `exportId`, como nos relatórios). */
  startDataExport(entities: ExportableEntity[]): Promise<StartDataExportResult> {
    return browserHttpClient.post<StartDataExportResult>(
      `${BASE}/exports`,
      entities.length > 0 ? { entities } : {},
    );
  },

  /** Mesmo acompanhamento dos relatórios. Cada chamada gera uma `downloadUrl` nova: nunca cachear. */
  getExport(id: string): Promise<ExportStatus> {
    return browserHttpClient.get<ExportStatus>(
      `/api/company/reports/exports/${encodeURIComponent(id)}`,
    );
  },

  getAuditLogs({ page, perPage, section }: AuditLogQuery): Promise<AuditLogPage> {
    const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
    if (section) params.set('section', section);
    return browserHttpClient.get<AuditLogPage>(`${BASE}/audit-logs?${params.toString()}`);
  },
};
