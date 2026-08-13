/**
 * Barrel export para o módulo de ManagementPlan
 */

// Types
export type {
  ManagementPlan,
  ManagementPlanItem,
  ManagementPlanItemCategory,
  ManagementPlanStatus,
  ManagementPlanListParams,
  ManagementPlanListResponse,
  ManagementPlanRef,
  ReviewDecision,
  ReviewManagementPlanData,
  ApiManagementPlan,
  ApiManagementPlanListResponse,
  ApiManagementPlanResponse,
} from './types';

// Schemas
export { reviewManagementPlanSchema } from './schemas';
export type { ReviewManagementPlanFormData } from './schemas';

// Services
export { managementPlanService } from './services/managementPlanService';

// Permissions
export {
  MANAGEMENT_PLAN_VIEW_ROLES,
  MANAGEMENT_PLAN_REVIEW_ROLES,
} from './utils/permissions';

// Hooks
export {
  useManagementPlans,
  useManagementPlan,
  useGenerateManagementPlan,
  useReviewManagementPlan,
} from './hooks';

// Components
export {
  ManagementPlanStatusBadge,
  ManagementPlanItemsTable,
  MissingSpeciesBanner,
  GenerateManagementPlanDialog,
  ReviewManagementPlanModal,
  ManagementPlanDetailPanel,
  ManagementPlanList,
  ManagementPlanSection,
} from './components';
