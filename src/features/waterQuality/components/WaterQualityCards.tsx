'use client';

import type { Quality } from '../types';
import { Badge } from '@/shared/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { CircleHelp, Droplets, LucideIcon } from 'lucide-react';
import { Sensor, SensorType, sensorTypeLabels } from '../../sensor/types';

function getQualityDotClass(quality: Quality): string {
  if (quality === 'excellent') return 'bg-emerald-500';
  if (quality === 'good') return 'bg-sky-500';
  if (quality === 'warning') return 'bg-amber-500';
  if (quality === 'critical') return 'bg-red-500';
  return 'bg-muted-foreground';
}

export interface WaterQualityCardsProps {
  readonly tankSummary: {
    name: string;
    id: string;
    worst: Quality;
    sensors: {
      sensor?: Sensor;
      quality: Quality;
    }[];
  }[];
  readonly qualityConfig: Record<
    Quality,
    { label: string; className: string; icon: React.ElementType }
  >;
  readonly typeIcon: Record<SensorType, LucideIcon>;
}

export function WaterQualityCards({
  tankSummary,
  qualityConfig,
  typeIcon,
}: Readonly<WaterQualityCardsProps>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tankSummary.map((tank) => {
        const cfg = qualityConfig[tank.worst];
        const QIcon = cfg.icon;
        return (
          <Card key={tank.name}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{tank.name}</CardTitle>
                </div>
                <Badge variant="outline" className={cfg.className}>
                  <QIcon className="mr-1 h-3 w-3" />
                  {cfg.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {tank.sensors.map((sensor, index) => {
                const sensorData = sensor.sensor;
                const iconKey = sensorData?.sensorType as SensorType;
                const Icon = typeIcon[iconKey] ?? CircleHelp;
                const c = qualityConfig[sensor.quality as Quality];
                return (
                  <div
                    key={`${tank.id}-${sensorData?.id ?? 'sem-sensor'}-${index}`}
                    className="flex items-center justify-between rounded-md border bg-card p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {sensorTypeLabels[iconKey] ?? 'Tipo desconhecido'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {sensorData?.lastReading !== null && sensorData?.lastReading !== undefined
                          ? `${sensorData.lastReading} ${sensorData.unit}`
                          : '—'}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${getQualityDotClass(sensor.quality)}`}
                        title={c.label}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
