import type { InventoryPreview } from '@/features/inventoryReport/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const ALLOWED_PARAMS = [
  'cutoffDate',
  'periodStart',
  'periodEnd',
  'situation',
  'includeInactive',
  'categories[]',
  'stockTypes[]',
  'supplyIds[]',
];

export const GET = createListGetHandler<{ response: InventoryPreview }, InventoryPreview>({
  backendPath: '/api/company/reports/inventory/preview',
  context: 'Inventory Report Preview API Proxy',
  mapResponse: (data) => data.response,
  buildQueryString: (searchParams) => {
    const out = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_PARAMS.includes(key) && value !== '') out.append(key, value);
    }
    return out.toString();
  },
});
