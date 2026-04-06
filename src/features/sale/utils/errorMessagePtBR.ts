/** Rótulos PT para status de venda (valores da API em inglês). */
const SALE_STATUS_LABEL_PT: Record<string, string> = {
  pending: 'pendente',
  confirmed: 'confirmado',
  cancelled: 'cancelado',
};

function statusLabelPt(value: string): string {
  const key = value.trim().toLowerCase();
  return SALE_STATUS_LABEL_PT[key] ?? value;
}

const EXACT_MAP: Record<string, string> = {
  // POST — SaleStoreRequest (custom)
  'The client is required.': 'O cliente é obrigatório.',
  'The client informed was not found.': 'O cliente informado não foi encontrado.',

  'The batch is required.': 'O lote é obrigatório.',
  'The batch informed was not found.': 'O lote informado não foi encontrado.',

  'The stocking is required.': 'O povoamento é obrigatório.',
  'The stocking informed was not found.': 'O povoamento informado não foi encontrado.',

  'The financial category informed was not found.':
    'A categoria financeira informada não foi encontrada.',

  'The total weight is required.': 'O peso total é obrigatório.',
  'The total weight must be numeric.': 'O peso total deve ser numérico.',
  'The total weight must be greater than zero.': 'O peso total deve ser maior que zero.',

  'The price per kg is required.': 'O preço por kg é obrigatório.',
  'The price per kg must be numeric.': 'O preço por kg deve ser numérico.',
  'The price per kg must be greater than zero.': 'O preço por kg deve ser maior que zero.',

  'The sale date is required.': 'A data da venda é obrigatória.',
  'The sale date must be a valid date.': 'A data da venda deve ser uma data válida.',

  'The status must be: pending, confirmed or cancelled.':
    'O status deve ser: pendente, confirmado ou cancelado.',

  'The needs invoice field must be true or false.':
    'O campo “necessita nota fiscal” deve ser verdadeiro ou falso.',
  'The total harvest field must be true or false.':
    'O campo “colheita total” deve ser verdadeiro ou falso.',

  // PUT — SaleUpdateRequest
  'The notes must not exceed 1000 characters.':
    'As observações não podem ter mais de 1000 caracteres.',

  // Regras de negócio / domínio (texto fixo em inglês)
  'It is not possible to edit the values of a sale with registered receipts.':
    'Não é possível alterar os valores de uma venda com recebimentos registrados.',

  // Laravel — company / UUID (comuns neste contexto)
  'The company id must be a valid UUID.': 'O ID da empresa deve ser um UUID válido.',
  'The selected company id is invalid.': 'A empresa selecionada não existe.',
  'The selected company does not exist.': 'A empresa selecionada não existe.',
};

function tryTranslateDynamicPattern(message: string): string | null {
  let m: RegExpMatchArray | null;

  m = message.match(
    /^The client \(id:\s*([^)]+)\) does not have CPF\/CNPJ and\/or address\.?/i,
  );
  if (m) {
    return `O cliente (id: ${m[1].trim()}) não possui CPF/CNPJ e/ou endereço cadastrado.`;
  }

  m = message.match(
    /^The client \(id:\s*([^)]+)\) has exceeded the credit limit\.\s*Limit:\s*(.+?)\s*\|\s*Current exposure:\s*(.+)$/i,
  );
  if (m) {
    return `O cliente (id: ${m[1].trim()}) excedeu o limite de crédito. Limite: ${m[2].trim()} | Exposição atual: ${m[3].trim()}`;
  }

  m = message.match(
    /^Insufficient biomass in the batch\/stocking \(id:\s*([^)]+)\)\.\s*Available:\s*(.+?)\s*\|\s*Requested:\s*(.+)$/i,
  );
  if (m) {
    return `Biomassa insuficiente no lote/povoamento (id: ${m[1].trim()}). Disponível: ${m[2].trim()} | Solicitado: ${m[3].trim()}`;
  }

  m = message.match(/^The stocking \(id:\s*([^)]+)\) has already been closed/i);
  if (m) {
    return `O povoamento (id: ${m[1].trim()}) já foi encerrado. Não é possível registrar novas vendas.`;
  }

  if (/^Could not resolve a company/i.test(message)) {
    return 'Não foi possível identificar a empresa para esta operação.';
  }

  m = message.match(/^Company \[(.+?)\] not found or not accessible\.?$/i);
  if (m) {
    return `A empresa “${m[1].trim()}” não foi encontrada ou não está acessível.`;
  }

  m = message.match(/^Cannot transition sale from \[(.+?)\] to \[(.+?)\]\.?$/i);
  if (m) {
    return `Não é possível alterar o status da venda de “${statusLabelPt(m[1])}” para “${statusLabelPt(m[2])}”.`;
  }

  m = message.match(/^Cannot transition sale from (\S+)\s+to\s+(\S+)\.?$/i);
  if (m) {
    return `Não é possível alterar o status da venda de “${statusLabelPt(m[1])}” para “${statusLabelPt(m[2])}”.`;
  }

  m = message.match(/^The total weight must be at least ([0-9][0-9.,]*)\.?$/i);
  if (m) {
    return `O peso total deve ser no mínimo ${m[1]}.`;
  }

  m = message.match(/^The total weight may not be greater than ([0-9][0-9.,]*)\.?$/i);
  if (m) {
    return `O peso total não pode ser maior que ${m[1]}.`;
  }

  m = message.match(/^The price per kg must be at least ([0-9][0-9.,]*)\.?$/i);
  if (m) {
    return `O preço por kg deve ser no mínimo ${m[1]}.`;
  }

  m = message.match(/^The price per kg may not be greater than ([0-9][0-9.,]*)\.?$/i);
  if (m) {
    return `O preço por kg não pode ser maior que ${m[1]}.`;
  }

  // exists / UUID — Laravel
  m = message.match(/^The selected client id is invalid\.?$/i);
  if (m) return 'O cliente informado não foi encontrado.';

  m = message.match(/^The selected batch id is invalid\.?$/i);
  if (m) return 'O lote informado não foi encontrado.';

  m = message.match(/^The selected stocking id is invalid\.?$/i);
  if (m) return 'O povoamento informado não foi encontrado.';

  m = message.match(/^The selected financial category id is invalid\.?$/i);
  if (m) return 'A categoria financeira informada não foi encontrada.';

  return null;
}

export function translateSaleApiErrorMessagePtBR(message: string): string {
  const normalized = message?.trim?.() ?? '';
  if (!normalized) return message;

  const withoutDoubleDot = normalized.replace(/\.\.$/, '.');
  const exact = EXACT_MAP[normalized] ?? EXACT_MAP[withoutDoubleDot];
  if (exact) return exact;

  const dynamic = tryTranslateDynamicPattern(normalized);
  if (dynamic) return dynamic;

  return message;
}
