import { UserRole } from '@/shared/types/auth';

export const MANAGEMENT_PLAN_VIEW_ROLES = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.OPERATOR,
];

export const MANAGEMENT_PLAN_REVIEW_ROLES = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
];
