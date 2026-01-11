import type { ApiTank, ApiTankListResponse, Tank, TankListResponse } from "../types";

export function mapApiTank(apiTank: ApiTank): Tank {
  return {
    id: apiTank.id,
    companyId: apiTank.company.id ?? "",
    tankTypeId: apiTank.tankType.id,
    name: apiTank.name,
    capacityLiters: apiTank.capacityLiters,
    location: apiTank.location,
    status: apiTank.status,
    created_at: apiTank.created_at,
    updated_at: apiTank.updated_at,
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

