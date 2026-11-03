import { Progress } from 'piuba-pescado-erp';

const Linha = ({ label, value }: { label: string; value: number }) => (
  <div style={{ width: 300 }}>
    <div className="mb-1 flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div>
    <Progress value={value} />
  </div>
);

export const Niveis = () => (
  <div className="flex flex-col gap-4">
    <Linha label="Ração consumida" value={25} />
    <Linha label="Ciclo de engorda" value={60} />
    <Linha label="Meta de despesca" value={100} />
  </div>
);
