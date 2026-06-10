import type { ApiTank, ApiTankListResponse, Tank, TankListResponse } from '../types';

export function mapApiTank(apiTank: ApiTank): Tank {
  return {
    id: apiTank.id,
    company: apiTank.company,
    tankType: apiTank.tankType,
    name: apiTank.name,
    capacityLiters: apiTank.capacityLiters,
    location: apiTank.location,
    status: apiTank.status,
    createdAt: apiTank.createdAt,
    updatedAt: apiTank.updatedAt,
  };
}

export function mapApiTankList(apiData: ApiTankListResponse): TankListResponse {
  const tanks: Tank[] = (apiData.response || []).map(mapApiTank);

  return {
    tanks,
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  };
}
