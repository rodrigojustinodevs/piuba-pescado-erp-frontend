import { UserRole } from '@/shared/types/auth';

/** Roles com a permissão `view-tank-report` no backend (operator não possui). */
export const TANK_REPORT_ROLES: string[] = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
];
