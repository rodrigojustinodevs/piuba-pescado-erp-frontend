import type { BatchDistributionPayload } from '@/features/batch';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Batch distribution API proxy';

export const POST = createUpsertHandler<unknown, BatchDistributionPayload>({
  backendPath: '/api/company/batches/distribution',
  method: 'POST',
  context: CONTEXT,
});
