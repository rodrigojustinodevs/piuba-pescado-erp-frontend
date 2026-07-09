/**
 * Barrel export para o módulo de User
 */

// Types
export type {
  User,
  CreateUserData,
  UpdateUserData,
  UserListResponse,
  UserStatus,
  ApiUser,
  ApiUserListResponse,
  UserDialogMode,
} from './types';

// Schemas
export { createUserSchema, updateUserSchema } from './schemas';
export type { CreateUserFormData, UpdateUserFormData } from './schemas';

// Services
export { userService } from './services/userService';

// Hooks
export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUsersListPage,
} from './hooks';
export type { UserStatusFilter, UserRoleFilter } from './hooks';

// Components
export { UserTable, UserDialog, UsersListView } from './components';
