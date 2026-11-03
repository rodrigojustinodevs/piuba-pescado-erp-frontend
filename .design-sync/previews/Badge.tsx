import { Badge } from 'piuba-pescado-erp';

export const Variantes = () => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge>Ativo</Badge>
    <Badge variant="secondary">Em manutenção</Badge>
    <Badge variant="destructive">Inativo</Badge>
    <Badge variant="outline">Rascunho</Badge>
  </div>
);
