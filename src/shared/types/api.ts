/**
 * Tipos genéricos de contrato com o backend.
 *
 * A ideia é centralizar paginação/formatos padrão e reutilizar em todas as features,
 * evitando duplicação em src/features/<feature>/types.ts.
 */

export type ApiPagination = {
  total: number;
  current_page: number;
  last_page: number;
  first_page: number;
  per_page: number;
};

export type ApiResponse<T> = {
  status: boolean;
  response: T;
  message: string;
};

export type ApiListResponse<T> = ApiResponse<T[]> & {
  pagination: ApiPagination;
};
