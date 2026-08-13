/**
 * Barrel export para o módulo de Species
 */

// Types
export type {
  Species,
  CreateSpeciesData,
  UpdateSpeciesData,
  SpeciesListResponse,
  GrowthCurvePoint,
  ApiSpecies,
  ApiSpeciesListResponse,
  ApiSpeciesResponse,
} from './types';

// Schemas
export { createSpeciesSchema, updateSpeciesSchema } from './schemas';
export type { CreateSpeciesFormData, UpdateSpeciesFormData } from './schemas';

// Services
export { speciesService } from './services/speciesService';

// Permissions
export { SPECIES_VIEW_ROLES, SPECIES_WRITE_ROLES } from './utils/permissions';

// Hooks
export {
  useSpeciesList,
  useSpecies,
  useCreateSpecies,
  useUpdateSpecies,
  useDeleteSpecies,
  useSpeciesListPage,
} from './hooks';

// Components
export {
  SpeciesTable,
  SpeciesListView,
  SpeciesDialog,
  GrowthCurveFieldArray,
} from './components';
export type { SpeciesDialogMode } from './components';
