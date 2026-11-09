import { fmtMoney } from '@/features/reportExport/format';
import { ReportSection, SectionEmpty } from '@/features/reportExport/ReportSection';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/Table';
import { cn } from '@/shared/lib/utils';
import type { MonthRow, Summary } from '../types';
import { fmtMonth } from '../utils/format';
import { CashFlowChart } from './CashFlowChartLazy';

type Column = {
  key: keyof MonthRow;
  label: string;
  /** Total vindo de `summary`; ausente = célula vazia (não somamos no cliente). */
  total?: (s: Summary) => number;
};

const COLUMNS: Column[] = [
  { key: 'month', label: 'Mês' },
  { key: 'revenueRealized', label: 'Receita realizada', total: (s) => s.revenueRealized },
  { key: 'expenseRealized', label: 'Despesa realizada', total: (s) => s.expenseRealized },
  { key: 'resultRealized', label: 'Resultado realizado', total: (s) => s.resultRealized },
  { key: 'revenueForecast', label: 'A receber', total: (s) => s.revenueForecast },
  { key: 'expenseForecast', label: 'A pagar', total: (s) => s.expenseForecast },
  { key: 'resultForecast', label: 'Resultado previsto', total: (s) => s.resultForecast },
  { key: 'accumulatedRealized', label: 'Saldo acumulado' },
];

function negative(value: number) {
  return value < 0 ? 'text-red-600' : undefined;
}

function isEmpty(months: MonthRow[]): boolean {
  return months.every((m) => COLUMNS.every((c) => c.key === 'month' || m[c.key] === 0));
}

export function CashFlowTable({
  months,
  summary,
}: Readonly<{ months: MonthRow[]; summary: Summary }>) {
  return (
    <ReportSection
      title="Fluxo de caixa mensal"
      description="Realizado no mês do pagamento; previsto no mês do vencimento."
    >
      {months.length === 0 || isEmpty(months) ? (
        <SectionEmpty>Nenhum lançamento encontrado para os filtros informados.</SectionEmpty>
      ) : (
        <div className="space-y-6">
          <CashFlowChart months={months} />
          <Table>
            <TableHeader>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn('whitespace-nowrap', col.key !== 'month' && 'text-right')}
                  >
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {months.map((row) => (
                <TableRow key={row.month}>
                  {COLUMNS.map((col) => {
                    if (col.key === 'month') {
                      return <TableCell key={col.key}>{fmtMonth(row.month)}</TableCell>;
                    }
                    const value = row[col.key] as number;
                    return (
                      <TableCell
                        key={col.key}
                        className={cn('whitespace-nowrap text-right tabular-nums', negative(value))}
                      >
                        {fmtMoney(value)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                {COLUMNS.map((col) => {
                  if (col.key === 'month') return <TableCell key={col.key}>Total</TableCell>;
                  const value = col.total?.(summary);
                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        'whitespace-nowrap text-right font-semibold tabular-nums',
                        value === undefined ? undefined : negative(value),
                      )}
                    >
                      {value === undefined ? '' : fmtMoney(value)}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </ReportSection>
  );
}
