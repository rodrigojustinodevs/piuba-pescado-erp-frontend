import type { TankType } from '../types';
import type { Company } from '@/features/company';

type MapDictionary = Record<string, string>;

export function buildTankTypeMap(tankTypes: unknown = []): MapDictionary {
  const list = Array.isArray(tankTypes) ? (tankTypes as TankType[]) : [];

  return list.reduce((acc, type) => {
    acc[type.id] = type.name;
    return acc;
  }, {} as MapDictionary);
}

export function buildCompanyMap(companies: Company[] = []): MapDictionary {
  return companies.reduce((acc, company) => {
    acc[company.id] = company.name;
    return acc;
  }, {} as MapDictionary);
}

export function getTankTypeLabel(map: MapDictionary, typeId?: string) {
  if (!typeId) return '-';
  return map[typeId] || typeId;
}

export function getCompanyName(map: MapDictionary, companyId?: string) {
  if (!companyId) return '-';
  return map[companyId] || companyId;
}
