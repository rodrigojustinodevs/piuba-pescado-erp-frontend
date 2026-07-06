import type { UpdateUserData } from '@/features/user';
import type { User } from '@/features/user/types';
import {
  createDeleteHandler,
  createDetailGetHandler,
  createPutHandler,
} from '@/shared/lib/api/routeFactories';

interface ApiUserResponse {
  status: boolean;
  response: User;
  message: string;
}

const CONTEXT = 'User By Id API Proxy';

export const GET = createDetailGetHandler<ApiUserResponse, User, { id: string }>({
  backendPathBuilder: ({ id }) => `/api/admin/user/${id}`,
  context: CONTEXT,
  mapResponse: (data) => data.response,
});

export const PUT = createPutHandler<ApiUserResponse, Omit<UpdateUserData, 'id'>, { id: string }>({
  backendPathBuilder: ({ id }) => `/api/admin/user/${id}`,
  context: CONTEXT,
  mapResponse: (data) => data.response,
});

export const DELETE = createDeleteHandler<{ id: string }>({
  backendPathBuilder: ({ id }) => `/api/admin/user/${id}`,
  context: CONTEXT,
});
