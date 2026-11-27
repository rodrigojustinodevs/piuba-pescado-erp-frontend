import { rolesWithPermission } from '@/shared/access/roles';

/** Gerar: a partir de operator. Revisar: a partir de manager (matriz da API). */
export const MANAGEMENT_PLAN_VIEW_ROLES = rolesWithPermission('view-management-plan');
export const MANAGEMENT_PLAN_GENERATE_ROLES = rolesWithPermission('generate-management-plan');
export const MANAGEMENT_PLAN_REVIEW_ROLES = rolesWithPermission('review-management-plan');
