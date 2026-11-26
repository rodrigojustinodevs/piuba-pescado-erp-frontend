'use client';

import {
  AlertTriangle,
  Fish,
  Gauge,
  LineChart,
  Percent,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';
import type { Species } from '../types';
import {
  DetailsCopyId,
  DetailsDialog,
  DetailsDialogBody,
  DetailsDialogFooter,
  DetailsDialogSkeleton,
  DetailsGrid,
  DetailsHero,
  DetailsSection,
  DetailsTile,
  DetailsTimestamps,
} from '@/shared/components/detailsDialog';

type SpeciesDetailsDialogProps = {
  readonly species: Species | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onEdit?: () => void;
};

const numberFmt = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function formatRange(
  min: number | undefined,
  max: number | undefined,
  unit: string,
): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null)
    return `${numberFmt.format(min)} – ${numberFmt.format(max)} ${unit}`;
  if (min != null) return `a partir de ${numberFmt.format(min)} ${unit}`;
  return `até ${numberFmt.format(max as number)} ${unit}`;
}

function formatValue(value: number | undefined, unit = ''): string | null {
  return value == null ? null : `${numberFmt.format(value)}${unit}`;
}

function GrowthCurveTable({
  points,
}: Readonly<{ points: NonNullable<Species['growthCurveReference']> }>) {
  const sorted = [...points].sort((a, b) => a.day - b.day);
  return (
    <div className="max-h-56 overflow-y-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-medium">
              Dia de cultivo
            </th>
            <th scope="col" className="px-3 py-2 text-right font-medium">
              Peso esperado
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {sorted.map((p) => (
            <tr key={p.day} className="border-t">
              <th scope="row" className="px-3 py-1.5 text-left font-normal">
                {numberFmt.format(p.day)}
              </th>
              <td className="px-3 py-1.5 text-right font-medium">
                {numberFmt.format(p.weightG)} g
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpeciesDetailsBody({ species }: Readonly<{ species: Species }>) {
  const curve = species.growthCurveReference ?? [];

  return (
    <DetailsDialogBody>
      <DetailsHero icon={Fish} title={species.name} tone="info">
        <DetailsCopyId id={species.id} label="ID da espécie" />
      </DetailsHero>

      <DetailsGrid>
        <DetailsTile icon={Thermometer} label="Temperatura ideal" emptyLabel="Não definida">
          {formatRange(species.idealTemperatureMin, species.idealTemperatureMax, '°C') && (
            <span className="text-lg tabular-nums">
              {formatRange(species.idealTemperatureMin, species.idealTemperatureMax, '°C')}
            </span>
          )}
        </DetailsTile>
        <DetailsTile icon={Waves} label="Salinidade ideal" emptyLabel="Não definida">
          {formatRange(species.idealSalinityMin, species.idealSalinityMax, 'ppt') && (
            <span className="text-lg tabular-nums">
              {formatRange(species.idealSalinityMin, species.idealSalinityMax, 'ppt')}
            </span>
          )}
        </DetailsTile>
        <DetailsTile
          icon={Wind}
          label="O₂ dissolvido ideal"
          hint="mínimo recomendado"
          emptyLabel="Não definido"
        >
          {formatValue(species.idealDissolvedOxygenMin, ' mg/L') && (
            <span className="tabular-nums">
              {formatValue(species.idealDissolvedOxygenMin, ' mg/L')}
            </span>
          )}
        </DetailsTile>
        <DetailsTile
          icon={AlertTriangle}
          label="O₂ dissolvido crítico"
          hint="abaixo disso há risco"
          emptyLabel="Não definido"
        >
          {formatValue(species.criticalDissolvedOxygenMin, ' mg/L') && (
            <span className="tabular-nums text-rose-700 dark:text-rose-400">
              {formatValue(species.criticalDissolvedOxygenMin, ' mg/L')}
            </span>
          )}
        </DetailsTile>
        <DetailsTile icon={Gauge} label="FCR esperado" emptyLabel="Não definido">
          {formatValue(species.expectedFcr) && (
            <span className="tabular-nums">{formatValue(species.expectedFcr)}</span>
          )}
        </DetailsTile>
        <DetailsTile
          icon={Percent}
          label="Alimentação máxima"
          hint="% da biomassa por dia"
          emptyLabel="Não definida"
        >
          {formatValue(species.maxFeedingRatePctBiomass, '%') && (
            <span className="tabular-nums">
              {formatValue(species.maxFeedingRatePctBiomass, '%')}
            </span>
          )}
        </DetailsTile>
      </DetailsGrid>

      <DetailsSection
        title="Curva de crescimento de referência"
        icon={LineChart}
        action={
          curve.length > 0 ? (
            <span className="text-xs tabular-nums text-muted-foreground">
              {curve.length} {curve.length === 1 ? 'ponto' : 'pontos'}
            </span>
          ) : undefined
        }
      >
        {curve.length > 0 ? (
          <GrowthCurveTable points={curve} />
        ) : (
          <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
            Nenhum ponto cadastrado.
          </p>
        )}
      </DetailsSection>

      <DetailsTimestamps createdAt={species.createdAt} updatedAt={species.updatedAt} />
    </DetailsDialogBody>
  );
}

export function SpeciesDetailsDialog({
  species,
  open,
  onOpenChange,
  onEdit,
}: SpeciesDetailsDialogProps) {
  return (
    <DetailsDialog
      open={open}
      onOpenChange={onOpenChange}
      title={species ? `Detalhes da espécie ${species.name}` : 'Detalhes da espécie'}
      description="Parâmetros biológicos de referência da espécie."
    >
      {species ? <SpeciesDetailsBody species={species} /> : <DetailsDialogSkeleton />}
      <DetailsDialogFooter
        onClose={() => onOpenChange(false)}
        onEdit={species ? onEdit : undefined}
        editLabel="Editar espécie"
      />
    </DetailsDialog>
  );
}
