import { Checkbox } from 'piuba-pescado-erp';

export const Padrao = () => <Checkbox label="Aceito os termos de uso" name="terms" />;
export const Marcado = () => (
  <Checkbox label="Tanque ativo" name="active" defaultChecked helperText="Tanques inativos não recebem alimentação." />
);
export const ComErro = () => <Checkbox label="Confirmo a despesca" name="harvest" error="Confirmação obrigatória" />;
export const Desabilitado = () => <Checkbox label="Lote encerrado" name="closed" disabled defaultChecked />;
