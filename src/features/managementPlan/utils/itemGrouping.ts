import type { ManagementPlanItem, ManagementPlanItemCategory } from '../types';

export const CATEGORY_ORDER: ManagementPlanItemCategory[] = [
  'feeding',
  'water_quality',
  'biometry',
  'health_alert',
];

export const CATEGORY_LABELS: Record<ManagementPlanItemCategory, string> = {
  feeding: 'Alimentação',
  water_quality: 'Qualidade da Água',
  biometry: 'Biometria',
  health_alert: 'Alertas Sanitários',
};

export type GroupedManagementPlanItems = Array<{
  category: ManagementPlanItemCategory;
  label: string;
  items: ManagementPlanItem[];
}>;

export function groupItemsByCategory(items: ManagementPlanItem[]): GroupedManagementPlanItems {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: items
      .filter((item) => item.category === category)
      .sort((a, b) => a.dayOffset - b.dayOffset),
  })).filter((group) => group.items.length > 0);
}
