export enum UserRole {
  MASTER = 'master',
  MASTER_ADMIN = 'master_admin',
  COMPANY_ADMIN = 'company_admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
}

export type UserRoleType = UserRole | string;

export type AuthenticatedUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRoleType;
  companyId?: string | null;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  isLoading: boolean;
};
