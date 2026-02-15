export enum UserRole {
  MASTER = 'master',
  COMPANY_ADMIN = 'company-admin',
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
