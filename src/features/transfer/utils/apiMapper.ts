import type {
  ApiTransferItem,
  ApiTransferListResponse,
  ApiTransferResponse,
  Transfer,
  TransferListResponse,
} from '../types';

function mapApiItemToTransfer(item: ApiTransferItem): Transfer {
  return {
    id: item.id,
    batchId: item.batch?.id ?? '',
    batchName: item.batch?.name,
    originTankId: item.originTank?.id ?? '',
    originTankName: item.originTank?.name,
    destinationTankId: item.destinationTank?.id ?? '',
    destinationTankName: item.destinationTank?.name,
    quantity: item.quantity,
    description: item.description,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function mapApiTransfer(apiData: ApiTransferResponse): Transfer {
  return mapApiItemToTransfer(apiData.response);
}

export function mapApiTransferList(apiData: ApiTransferListResponse): TransferListResponse {
  const items: ApiTransferItem[] = apiData.response ?? [];
  const transfers: Transfer[] = items.map(mapApiItemToTransfer);

  return {
    transfers,
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
