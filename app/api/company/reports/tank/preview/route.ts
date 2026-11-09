import type { TankPreview } from '@/features/tankReport/types';
import { createListGetHandler } from '@/shared/lib/api/routeFactories';

const ALLOWED_PARAMS = ['cutoffDate', 'status', 'occupancy', 'tankIds[]', 'tankTypeIds[]'];

export const GET = createListGetHandler<{ response: TankPreview }, TankPreview>({
  backendPath: '/api/company/reports/tank/preview',
  context: 'Tank Report Preview API Proxy',
  mapResponse: (data) => data.response,
  buildQueryString: (searchParams) => {
    const out = new URLSearchParams();
    for (const [key, value] of searchParams.entries()) {
      if (ALLOWED_PARAMS.includes(key) && value !== '') out.append(key, value);
    }
    return out.toString();
  },
});
