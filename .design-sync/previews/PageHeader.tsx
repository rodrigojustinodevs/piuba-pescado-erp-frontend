import { PageHeader, TankIcon } from 'piuba-pescado-erp';

export const Completo = () => (
  <PageHeader
    breadcrumb="Início / Tanques"
    title="Tanques"
    subtitle="Gerencie os tanques e seus lotes ativos"
    icon={<TankIcon className="h-6 w-6 text-[#0EA5A4]" />}
  />
);
export const SemSubtitulo = () => (
  <PageHeader breadcrumb="Início / Lotes" title="Lotes" icon={<TankIcon className="h-6 w-6 text-[#0EA5A4]" />} />
);
