'use client';

import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts';
import { useReportFormatters } from '@/features/reportExport/useReportFormatters';
import { ChartContainer } from '@/shared/components/ui/Chart';
import type { MonthRow } from '../types';
import { fmtMonth } from '../utils/format';

const REVENUE = '#0EA5A4';
const EXPENSE = '#D97706';
const BALANCE = '#2563EB';

export default function CashFlowChart({ months }: Readonly<{ months: MonthRow[] }>) {
  const { fmtMoney } = useReportFormatters();
  return (
    <ChartContainer
      config={{}}
      className="aspect-auto h-80 w-full"
      role="img"
      aria-label="Receita e despesa realizadas e previstas por mês, com saldo acumulado"
    >
      <ComposedChart data={months} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tickFormatter={fmtMonth} />
        <YAxis tickFormatter={(v) => fmtMoney(v as number)} width={96} />
        <Tooltip
          formatter={(value, name) => [fmtMoney(value as number), String(name)]}
          labelFormatter={(label) => fmtMonth(String(label))}
        />
        <Legend />
        <Bar dataKey="revenueRealized" name="Receita realizada" fill={REVENUE} />
        <Bar dataKey="expenseRealized" name="Despesa realizada" fill={EXPENSE} />
        <Bar
          dataKey="revenueForecast"
          name="A receber"
          fill={REVENUE}
          fillOpacity={0.3}
          stroke={REVENUE}
          strokeDasharray="4 3"
        />
        <Bar
          dataKey="expenseForecast"
          name="A pagar"
          fill={EXPENSE}
          fillOpacity={0.3}
          stroke={EXPENSE}
          strokeDasharray="4 3"
        />
        <Line
          type="monotone"
          dataKey="accumulatedRealized"
          name="Saldo acumulado"
          stroke={BALANCE}
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ChartContainer>
  );
}
