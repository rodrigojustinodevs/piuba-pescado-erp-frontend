import type { ApiUser, ApiUserListResponse, User, UserListResponse } from '../types';

export function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    position: apiUser.position,
    role: apiUser.role,
    status: apiUser.status,
    company: apiUser.company,
    lastAccessAt: apiUser.lastAccessAt,
    createdAt: apiUser.createdAt,
    updatedAt: apiUser.updatedAt,
  };
}

export function mapApiUserList(apiData: ApiUserListResponse): UserListResponse {
  const users: User[] = (apiData.response || []).map(mapApiUser);

  return {
    users,
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  };
}
