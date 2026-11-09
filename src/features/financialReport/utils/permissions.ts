import { UserRole } from '@/shared/types/auth';

/** Roles com a permissão `view-financial-report` no backend (manager e operator não possuem). */
export const FINANCIAL_REPORT_ROLES: string[] = [
  UserRole.MASTER,
  UserRole.MASTER_ADMIN,
  UserRole.COMPANY_ADMIN,
  UserRole.ADMIN,
];
