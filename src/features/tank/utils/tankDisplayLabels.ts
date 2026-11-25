import { CircleCheck, CirclePause, Wrench, type LucideIcon } from 'lucide-react';
import type { TankStatus } from '../types';

type TankStatusConfig = {
  label: string;
  variant: 'default' | 'secondary' | 'destructive';
  icon: LucideIcon;
};

export const TANK_STATUS_CONFIG: Record<TankStatus, TankStatusConfig> = {
  active: { label: 'Ativo', variant: 'default', icon: CircleCheck },
  inactive: { label: 'Inativo', variant: 'secondary', icon: CirclePause },
  maintenance: { label: 'Manutenção', variant: 'destructive', icon: Wrench },
};

export const TANK_STATUS_FILTER_OPTIONS: Array<{ value: 'all' | TankStatus; label: string }> = [
  { value: 'all', label: 'Todos os Status' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'maintenance', label: 'Manutenção' },
];

export function getTankStatusConfig(status: string): TankStatusConfig {
  return (
    TANK_STATUS_CONFIG[status as TankStatus] ?? {
      label: 'Desconhecido',
      variant: 'secondary',
      icon: Wrench,
    }
  );
}
