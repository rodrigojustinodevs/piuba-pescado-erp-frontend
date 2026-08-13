import { UserRole } from '@/shared/types/auth';

export const SPECIES_VIEW_ROLES = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];

export const SPECIES_WRITE_ROLES = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
];
