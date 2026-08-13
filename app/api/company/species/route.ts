import type { ApiSpeciesResponse, CreateSpeciesData, Species } from '@/features/species';
import { mapApiSpecies } from '@/features/species/utils/apiMapper';
import { createUpsertHandler } from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Species API Proxy';

export const POST = createUpsertHandler<ApiSpeciesResponse, CreateSpeciesData>({
  backendPath: '/api/company/species',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data): Species => mapApiSpecies(data.response),
});
