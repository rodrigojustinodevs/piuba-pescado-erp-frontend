export type {
  Mortality,
  MortalityListResponse,
  ApiMortality,
  ApiMortalityListResponse,
  CreateMortalityData,
  UpdateMortalityData,
  MortalityDialogMode,
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
  MortalityDialog,
  MortalityViewDialogContent,
} from './components';
export { mortalityService } from './services/mortalityService';
