import type { ApiListEnvelope, Invoice, InvoiceListResponse } from '@/features/billing/types';
import { mapInvoiceListEnvelope } from '@/features/billing/utils/apiMapper';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const STATUSES = new Set(['pending', 'overdue', 'paid', 'refunded', 'canceled']);

function buildInvoicesQuery(searchParams: URLSearchParams): string {
  const out = new URLSearchParams();
  const status = searchParams.get('status');
  if (status && STATUSES.has(status)) out.set('status', status);
  const perPage = Number(searchParams.get('per_page'));
  if (Number.isInteger(perPage) && perPage >= 1)
    out.set('per_page', String(Math.min(perPage, 100)));
  const page = Number(searchParams.get('page'));
  if (Number.isInteger(page) && page >= 1) out.set('page', String(page));
  return out.toString();
}

export const GET = createListGetHandler<ApiListEnvelope<Invoice>, InvoiceListResponse>({
  backendPath: '/api/billing/invoices',
  context: 'Billing Invoices API Proxy',
  buildQueryString: buildInvoicesQuery,
  mapResponse: mapInvoiceListEnvelope,
});
