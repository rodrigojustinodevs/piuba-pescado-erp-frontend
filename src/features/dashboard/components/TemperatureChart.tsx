'use client';

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer } from '@/shared/components/ui/Chart';
import type { DailyTemperature } from '../utils/aggregate';

const config = { temp: { label: 'Temperatura (°C)', color: 'var(--color-chart-1)' } };

export default function TemperatureChart({ data }: Readonly<{ data: DailyTemperature[] }>) {
  return (
    <ChartContainer config={config} className="h-[320px] w-full">
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          domain={['auto', 'auto']}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [`${value} °C`, 'Temperatura']}
          contentStyle={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="temp"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
