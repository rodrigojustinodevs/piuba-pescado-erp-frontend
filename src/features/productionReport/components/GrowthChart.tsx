'use client';

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '@/shared/components/ui/Chart';
import type { GrowthPoint } from '../types';
import { fmtNumber } from '@/features/reportExport/format';

const PALETTE = [
  '#0EA5A4',
  '#2563EB',
  '#D97706',
  '#7C3AED',
  '#DB2777',
  '#4D7C0F',
  '#0891B2',
  '#B45309',
];

export default function GrowthChart({ points }: Readonly<{ points: GrowthPoint[] }>) {
  const batches = [...new Set(points.map((p) => p.batchName))];
  const byDay = new Map<number, Record<string, number | null>>();

  for (const p of points) {
    const row = byDay.get(p.day) ?? { day: p.day };
    row[`${p.batchName}|real`] = p.actualG;
    row[`${p.batchName}|exp`] = p.expectedG;
    byDay.set(p.day, row);
  }
  const data = [...byDay.values()].sort((a, b) => (a.day as number) - (b.day as number));

  return (
    <ChartContainer
      config={{}}
      className="aspect-auto h-80 w-full"
      role="img"
      aria-label="Peso real e esperado por dia de cultivo"
    >
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          type="number"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(v) => `${v}d`}
        />
        <YAxis tickFormatter={(v) => `${fmtNumber(v as number)} g`} width={64} />
        <Tooltip
          formatter={(value, name) => [`${fmtNumber(value as number, 1)} g`, String(name)]}
          labelFormatter={(label) => `Dia ${label}`}
        />
        <Legend />
        {batches.flatMap((batch, i) => {
          const color = PALETTE[i % PALETTE.length];
          return [
            <Line
              key={`${batch}-real`}
              dataKey={`${batch}|real`}
              name={`${batch} (real)`}
              stroke={color}
              strokeWidth={2}
              connectNulls
              isAnimationActive={false}
            />,
            <Line
              key={`${batch}-exp`}
              dataKey={`${batch}|exp`}
              name={`${batch} (esperado)`}
              stroke={color}
              strokeDasharray="5 4"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />,
          ];
        })}
      </LineChart>
    </ChartContainer>
  );
}
