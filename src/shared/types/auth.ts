export enum UserRole {
  MASTER = 'master',
  MASTER_ADMIN = 'master_admin',
  COMPANY_ADMIN = 'company_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  GUEST = 'guest',
}

export type UserRoleType = UserRole | string;

export type AuthenticatedUser = {
  id: string;
  email: string;
  name?: string;
  role: UserRoleType;
  companyId?: string | null;
  companies?: { id: string; name: string; role: string }[];
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  isLoading: boolean;
};
