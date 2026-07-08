import { Radio, Wifi, Gauge, Webhook, Globe } from 'lucide-react';
import type { IntegrationStatus, IntegrationType } from '../types';

export const TYPE_LABELS: Record<IntegrationType, string> = {
  gateway: 'Gateway',
  sensor: 'Sensor',
  controller: 'Controlador',
  webhook: 'Webhook',
  external_api: 'API Externa',
};

export const TYPE_ICONS: Record<IntegrationType, typeof Radio> = {
  gateway: Radio,
  sensor: Wifi,
  controller: Gauge,
  webhook: Webhook,
  external_api: Globe,
};

export const TYPE_FILTER_OPTIONS: Array<{ value: 'all' | IntegrationType; label: string }> = [
  { value: 'all', label: 'Todos os tipos' },
  { value: 'gateway', label: TYPE_LABELS.gateway },
  { value: 'sensor', label: TYPE_LABELS.sensor },
  { value: 'controller', label: TYPE_LABELS.controller },
  { value: 'webhook', label: TYPE_LABELS.webhook },
  { value: 'external_api', label: TYPE_LABELS.external_api },
];

export const STATUS_LABELS: Record<IntegrationStatus, string> = {
  connected: 'Conectado',
  error: 'Erro',
  disconnected: 'Desconectado',
  pending: 'Pendente',
};

export const STATUS_BADGE_STYLES: Record<IntegrationStatus, string> = {
  connected: 'bg-emerald-500 text-white border-transparent hover:bg-emerald-500',
  error: 'bg-red-500 text-white border-transparent hover:bg-red-500',
  disconnected: 'bg-slate-400 text-white border-transparent hover:bg-slate-400',
  pending: 'bg-amber-500 text-white border-transparent hover:bg-amber-500',
};

export const STATUS_FILTER_OPTIONS: Array<{ value: 'all' | IntegrationStatus; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'connected', label: STATUS_LABELS.connected },
  { value: 'error', label: STATUS_LABELS.error },
  { value: 'disconnected', label: STATUS_LABELS.disconnected },
  { value: 'pending', label: STATUS_LABELS.pending },
];
