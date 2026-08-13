import type { ApiSpecies, ApiSpeciesListResponse, Species, SpeciesListResponse } from '../types';

export function mapApiSpecies(apiSpecies: ApiSpecies): Species {
  return {
    id: apiSpecies.id,
    name: apiSpecies.name,
    idealTemperatureMin: apiSpecies.idealTemperatureMin,
    idealTemperatureMax: apiSpecies.idealTemperatureMax,
    idealDissolvedOxygenMin: apiSpecies.idealDissolvedOxygenMin,
    criticalDissolvedOxygenMin: apiSpecies.criticalDissolvedOxygenMin,
    idealSalinityMin: apiSpecies.idealSalinityMin,
    idealSalinityMax: apiSpecies.idealSalinityMax,
    expectedFcr: apiSpecies.expectedFcr,
    maxFeedingRatePctBiomass: apiSpecies.maxFeedingRatePctBiomass,
    growthCurveReference: apiSpecies.growthCurveReference ?? [],
    createdAt: apiSpecies.createdAt,
    updatedAt: apiSpecies.updatedAt,
  };
}

export function mapApiSpeciesList(apiData: ApiSpeciesListResponse): SpeciesListResponse {
  const species: Species[] = (apiData.response || []).map(mapApiSpecies);

  return {
    species,
    total: apiData.pagination?.total || 0,
    page: apiData.pagination?.current_page || 1,
    limit: apiData.pagination?.per_page || 10,
  };
}
