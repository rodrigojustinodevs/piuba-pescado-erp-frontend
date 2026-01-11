/**
 * Barrel export para o módulo de Tank
 */

// Types
export type {
  Tank,
  CreateTankData,
  UpdateTankData,
  TankListResponse,
  TankType,
  ApiTank,
  ApiTankListResponse,
} from "./types";

// Schemas
export { createTankSchema, updateTankSchema } from "./schemas";
export type { CreateTankFormData, UpdateTankFormData } from "./schemas";

// Services
export { tankService } from "./services/tankService";

// Hooks
export {
  useTanks,
  useTank,
  useCreateTank,
  useUpdateTank,
  useDeleteTank,
  useTankTypes,
  useTankLookups,
} from "./hooks";

// Components
export { TankForm, TankTable } from "./components";


