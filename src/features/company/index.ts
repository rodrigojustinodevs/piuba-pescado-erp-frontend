/**
 * Barrel export para o módulo de Company
 */

// Types
export type {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
  CompanyListResponse,
} from "./types";

// Schemas
export { createCompanySchema, updateCompanySchema } from "./schemas";
export type { CreateCompanyFormData, UpdateCompanyFormData } from "./schemas";

// Services
export { companyService } from "./services/companyService";

// Hooks
export {
  useCompanies,
  useCompany,
  useCreateCompany,
  useUpdateCompany,
  useDeleteCompany,
} from "./hooks";

