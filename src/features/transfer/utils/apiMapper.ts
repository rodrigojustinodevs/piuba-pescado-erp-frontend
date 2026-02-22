import type {
  ApiTransferListResponse,
  ApiTransferResponse,
  Transfer,
  TransferListResponse,
} from '../types';

export function mapApiTransfer(apiData: ApiTransferResponse): Transfer {
  return apiData.response;
}

export function mapApiTransferList(apiData: ApiTransferListResponse): TransferListResponse {
  const transfers: Transfer[] = apiData.response ?? [];

  return {
    transfers,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
