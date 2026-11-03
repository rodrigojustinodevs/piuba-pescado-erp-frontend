import { ListHeader, TankIcon } from 'piuba-pescado-erp';

export const ComAcao = () => (
  <div style={{ width: 640 }}>
    <ListHeader
      icon={<TankIcon className="h-6 w-6 text-[#0EA5A4]" />}
      title="Tanques"
      subtitle="18 tanques cadastrados"
      ctaLabel="Novo tanque"
      ctaOnClick={() => {}}
      setDialogOpen={() => {}}
    />
  </div>
);
export const SemAcao = () => (
  <div style={{ width: 640 }}>
    <ListHeader icon={<TankIcon className="h-6 w-6 text-[#0EA5A4]" />} title="Lotes" subtitle="Histórico de lotes" setDialogOpen={() => {}} />
  </div>
);
