import { NotFoundState } from 'piuba-pescado-erp';

export const ComLink = () => (
  <NotFoundState message="Tanque não encontrado." backHref="/tanques" backLabel="Voltar para tanques" />
);
export const SemLink = () => <NotFoundState message="Lote não encontrado." />;
