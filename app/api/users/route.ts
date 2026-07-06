import type { UserListResponse, CreateUserData } from '@/features/user';
import type { ApiUserListResponse, User } from '@/features/user/types';
import { mapApiUserList } from '@/features/user/utils/apiMapper';
import { createListGetHandler, createUpsertHandler } from '@/shared/lib/api/routeFactories';
import { buildPaginationQueryString } from '@/shared/lib/pagination/paginationQuery';

interface ApiUserResponse {
  status: boolean;
  response: User;
  message: string;
}

const CONTEXT = 'Users API Proxy';

export const GET = createListGetHandler<ApiUserListResponse, UserListResponse>({
  backendPath: '/api/admin/users',
  context: CONTEXT,
  buildQueryString: (searchParams) =>
    buildPaginationQueryString(searchParams, {
      defaultLimit: 10,
    }),
  mapResponse: mapApiUserList,
});

export const POST = createUpsertHandler<ApiUserResponse, CreateUserData>({
  backendPath: '/api/admin/user',
  method: 'POST',
  context: CONTEXT,
  mapResponse: (data) => data.response,
});
