import { toDateTimeLocalInputValue } from '@/shared/utils/datetimeForm';
import type { CreateWaterQualityFormData } from '../schemas';
import type { WaterQuality } from '../types';

function parseMetric(value: string): number {
  const n = Number.parseFloat(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

export function waterQualityToFormValues(record: WaterQuality): CreateWaterQualityFormData {
  return {
    tankId: record.tank.id,
    measuredAt: toDateTimeLocalInputValue(record.measuredAt),
    ph: parseMetric(record.ph),
    dissolvedOxygen: parseMetric(record.dissolvedOxygen),
    temperature: parseMetric(record.temperature),
    ammonia: parseMetric(record.ammonia),
    salinity: parseMetric(record.salinity),
    turbidity: parseMetric(record.turbidity),
    notes: record.notes ?? '',
  };
}
