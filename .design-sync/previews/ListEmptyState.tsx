import { ListEmptyState } from 'piuba-pescado-erp';

export const ComSubtitulo = () => (
  <ListEmptyState title="Nenhum tanque cadastrado" subtitle="Cadastre o primeiro tanque para começar o manejo." />
);
export const Simples = () => <ListEmptyState title="Nenhum lote encontrado" />;
