import type { User, CreateUserData, UpdateUserData, UserListResponse } from '../types';
import { browserHttpClient } from '@/shared/lib/http/browserHttpClient';
import { buildQueryString } from '@/shared/utils/queryString';

export const userService = {
  async list(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> {
    const queryString = buildQueryString(
      {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      },
      { skipEmptyString: true },
    );
    const endpoint = queryString
      ? `/api/company/users?${queryString}`
      : '/api/company/users';
    return browserHttpClient.get<UserListResponse>(endpoint);
  },

  async getById(id: string): Promise<User> {
    return browserHttpClient.get<User>(`/api/company/users/${id}`);
  },

  async create(data: CreateUserData): Promise<User> {
    return browserHttpClient.post<User>('/api/company/users', data);
  },

  async update(data: UpdateUserData): Promise<User> {
    const { id, ...updateData } = data;
    return browserHttpClient.put<User>(`/api/company/users/${id}`, updateData);
  },

  async delete(id: string): Promise<void> {
    await browserHttpClient.delete<null>(`/api/company/users/${id}`);
  },
};
