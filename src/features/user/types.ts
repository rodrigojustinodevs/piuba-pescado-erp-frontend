/**
 * Tipos relacionados à entidade User (gestão de usuários da empresa)
 */

import type { ApiListResponse } from '@/shared/types/api';
import type { UserRoleType } from '@/shared/types/auth';
import type { DataTableAction } from '@/shared/components/Table';

export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface UserCompany {
  id?: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  role: UserRoleType;
  status: UserStatus;
  company: UserCompany;
  lastAccessAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  companyId: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  role: UserRoleType;
  status: UserStatus;
  password?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

/**
 * Formato de usuário retornado pela API (camelCase com objetos aninhados)
 */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  role: UserRoleType;
  status: UserStatus;
  company: UserCompany;
  lastAccessAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Formato de resposta da API para listagem
 */
export type ApiUserListResponse = ApiListResponse<ApiUser>;

/**
 * Formato padronizado para uso no frontend
 */
export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export type UserDialogMode = 'create' | 'edit' | 'view';

export interface UserTableProps {
  users: User[];
  rowActions: (user: User) => DataTableAction[];
}
