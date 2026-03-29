export type {
  Mortality,
  MortalityListResponse,
  ApiMortality,
  ApiMortalityListResponse,
  CreateMortalityData,
  UpdateMortalityData,
} from './types';
export { createMortalitySchema } from './schemas';
export type { CreateMortalityFormData } from './schemas';
export {
  useMortalities,
  useMortalitiesListPage,
  useCreateMortality,
  useMortality,
  useUpdateMortality,
  useDeleteMortality,
} from './hooks';
export {
  MortalityTable,
  MortalitiesListView,
  MortalityPageShell,
  MortalityForm,
  MortalityDetailView,
} from './components';
export { mortalityService } from './services/mortalityService';
