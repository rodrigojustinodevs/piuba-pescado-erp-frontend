import type { AuditLogPage, SettingChange } from '@/features/companySettings/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

type BackendAuditLogs = {
  response?: SettingChange[];
  pagination?: { total?: number; current_page?: number; last_page?: number; per_page?: number };
};

const SECTION = /^[a-z_]+$/;

function buildQueryString(searchParams: URLSearchParams): string {
  const params = new URLSearchParams();
  const page = Number(searchParams.get('page'));
  const perPage = Number(searchParams.get('perPage'));
  const section = searchParams.get('section');
  if (Number.isInteger(page) && page > 0) params.set('page', String(page));
  if (Number.isInteger(perPage) && perPage > 0)
    params.set('perPage', String(Math.min(perPage, 100)));
  if (section && SECTION.test(section)) params.set('section', section);
  return params.toString();
}

export const GET = createListGetHandler<BackendAuditLogs, AuditLogPage>({
  backendPath: '/api/company/settings/audit-logs',
  context: 'Company Settings Audit Logs API Proxy',
  buildQueryString,
  mapResponse: (data) => ({
    items: data.response ?? [],
    total: data.pagination?.total ?? 0,
    page: data.pagination?.current_page ?? 1,
    lastPage: data.pagination?.last_page ?? 1,
    perPage: data.pagination?.per_page ?? 25,
  }),
});
