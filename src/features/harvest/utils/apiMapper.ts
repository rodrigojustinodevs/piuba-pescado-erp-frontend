import type {
  ApiHarvestItem,
  ApiHarvestListResponse,
  ApiHarvestResponse,
  ApiSizeClassification,
  Harvest,
  HarvestListResponse,
  SizeClassification,
} from '../types';

function mapClassification(c: ApiSizeClassification): SizeClassification {
  return {
    class: c.class,
    quantity: c.quantity,
    averageWeight: c.averageWeight ?? c.average_weight ?? 0,
    pricePerKg: c.pricePerKg ?? c.price_per_kg ?? 0,
  };
}

function mapApiItemToHarvest(item: ApiHarvestItem): Harvest {
  return {
    id: item.id,
    batchId: item.batch?.id ?? item.batchId ?? item.batch_id ?? '',
    batchName: item.batch?.name,
    batch: item.batch,
    tankId: item.tank?.id ?? item.tankId ?? item.tank_id ?? '',
    tankName: item.tank?.name,
    harvestDate: item.harvestDate ?? item.harvest_date ?? '',
    type: item.type,
    status: item.status,
    destination: item.destination,
    initialPopulation: item.initialPopulation ?? item.initial_population,
    harvestedQuantity: item.harvestedQuantity ?? item.harvested_quantity ?? 0,
    averageWeight: item.averageWeight ?? item.average_weight ?? 0,
    sizeClassifications: (item.sizeClassifications ?? item.size_classifications ?? []).map(
      mapClassification,
    ),
    clientDestination: item.clientDestination ?? item.client_destination,
    responsible: item.responsible,
    operationalCost: item.operationalCost ?? item.operational_cost,
    notes: item.notes,
    createdAt: item.createdAt ?? item.created_at ?? null,
    updatedAt: item.updatedAt ?? item.updated_at ?? null,
  };
}

export function mapApiHarvest(apiData: ApiHarvestResponse): Harvest {
  return mapApiItemToHarvest(apiData.response);
}

export function mapApiHarvestList(apiData: ApiHarvestListResponse): HarvestListResponse {
  const items: ApiHarvestItem[] = apiData.response ?? [];
  return {
    harvests: items.map(mapApiItemToHarvest),
    total: apiData.pagination?.total ?? 0,
    page: apiData.pagination?.current_page ?? 1,
    limit: apiData.pagination?.per_page ?? 25,
  };
}
