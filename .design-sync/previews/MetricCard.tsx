import { MetricCard } from 'piuba-pescado-erp';

export const Crescimento = () => (
  <div style={{ width: 260 }}>
    <MetricCard label="Peixes vivos" value="12.480" change={{ value: '+4,2%', isPositive: true }} color="blue" />
  </div>
);

export const Queda = () => (
  <div style={{ width: 260 }}>
    <MetricCard label="Taxa de mortalidade" value="1,8%" change={{ value: '-0,3%', isPositive: false }} color="red" />
  </div>
);

export const SemVariacao = () => (
  <div style={{ width: 260 }}>
    <MetricCard label="Tanques ativos" value={18} color="light-blue" />
  </div>
);
