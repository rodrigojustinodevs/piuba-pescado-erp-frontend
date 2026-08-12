import type { ApiSpeciesResponse, CreateSpeciesData, Species } from '@/features/species';
import { mapApiSpecies } from '@/features/species/utils/apiMapper';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

const CONTEXT = 'Species Detail API Proxy';

type RouteParams = { id: string };

export const GET = createDetailGetHandler<ApiSpeciesResponse, Species, RouteParams>({
  backendPathBuilder: (params) => `/api/company/species/${params.id}`,
  context: CONTEXT,
  mapResponse: (data): Species => mapApiSpecies(data.response),
});

export const PUT = createPutHandler<ApiSpeciesResponse, Omit<CreateSpeciesData, 'id'>, RouteParams>({
  backendPathBuilder: (params) => `/api/company/species/${params.id}`,
  context: CONTEXT,
  mapResponse: (data): Species => mapApiSpecies(data.response),
});

export const DELETE = createDeleteHandler<RouteParams>({
  backendPathBuilder: (params) => `/api/company/species/${params.id}`,
  context: CONTEXT,
});
