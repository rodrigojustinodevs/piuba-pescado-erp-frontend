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

function parseClientIdForMissingCpfOrAddress(message: string): string | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'the client (id:';
  const suffix = ') does not have cpf/cnpj and/or address';

  if (!lower.startsWith(prefix)) return null;
  if (!lower.endsWith(suffix) && !lower.endsWith(`${suffix}.`)) return null;

  const closeParenIndex = source.indexOf(')');
  if (closeParenIndex < 0) return null;

  const idStart = source.indexOf(':') + 1;
  if (idStart <= 0 || idStart >= closeParenIndex) return null;

  const clientId = source.slice(idStart, closeParenIndex).trim();
  return clientId || null;
}

function parseClientCreditLimitExceeded(
  message: string,
): { clientId: string; limit: string; currentExposure: string } | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'the client (id:';
  const middle = ') has exceeded the credit limit.';
  const limitTag = 'limit:';
  const exposureTag = '| current exposure:';

  if (!lower.startsWith(prefix)) return null;
  const middleIndex = lower.indexOf(middle);
  if (middleIndex < 0) return null;

  const clientId = source.slice(prefix.length, middleIndex).trim();
  if (!clientId) return null;

  const afterMiddle = source.slice(middleIndex + middle.length).trim();
  const afterMiddleLower = afterMiddle.toLowerCase();
  if (!afterMiddleLower.startsWith(limitTag)) return null;

  const exposureIndex = afterMiddleLower.indexOf(exposureTag);
  if (exposureIndex < 0) return null;

  const limit = afterMiddle.slice(limitTag.length, exposureIndex).trim();
  const currentExposure = afterMiddle.slice(exposureIndex + exposureTag.length).trim();
  if (!limit || !currentExposure) return null;

  return { clientId, limit, currentExposure };
}

function parseInsufficientBiomass(
  message: string,
): { stockingId: string; available: string; requested: string } | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'insufficient biomass in the batch/stocking (id:';
  const middle = ').';
  const availableTag = 'available:';
  const requestedTag = '| requested:';

  if (!lower.startsWith(prefix)) return null;
  const middleIndex = lower.indexOf(middle);
  if (middleIndex < 0) return null;

  const stockingId = source.slice(prefix.length, middleIndex).trim();
  if (!stockingId) return null;

  const afterMiddle = source.slice(middleIndex + middle.length).trim();
  const afterMiddleLower = afterMiddle.toLowerCase();
  if (!afterMiddleLower.startsWith(availableTag)) return null;

  const requestedIndex = afterMiddleLower.indexOf(requestedTag);
  if (requestedIndex < 0) return null;

  const available = afterMiddle.slice(availableTag.length, requestedIndex).trim();
  const requested = afterMiddle.slice(requestedIndex + requestedTag.length).trim();
  if (!available || !requested) return null;

  return { stockingId, available, requested };
}

function parseClosedStockingId(message: string): string | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'the stocking (id:';
  const suffix = ') has already been closed';

  if (!lower.startsWith(prefix)) return null;
  if (!lower.endsWith(suffix) && !lower.endsWith(`${suffix}.`)) return null;

  const suffixStart = lower.lastIndexOf(suffix);
  if (suffixStart < prefix.length) return null;

  const stockingId = source.slice(prefix.length, suffixStart).trim();
  return stockingId || null;
}

function tryTranslateDynamicPattern(message: string): string | null {
  let m: RegExpMatchArray | null;

  const clientIdMissingCpfOrAddress = parseClientIdForMissingCpfOrAddress(message);
  if (clientIdMissingCpfOrAddress) {
    return `O cliente (id: ${clientIdMissingCpfOrAddress}) não possui CPF/CNPJ e/ou endereço cadastrado.`;
  }

  const creditLimitExceeded = parseClientCreditLimitExceeded(message);
  if (creditLimitExceeded) {
    return `O cliente (id: ${creditLimitExceeded.clientId}) excedeu o limite de crédito. Limite: ${creditLimitExceeded.limit} | Exposição atual: ${creditLimitExceeded.currentExposure}`;
  }

  const insufficientBiomass = parseInsufficientBiomass(message);
  if (insufficientBiomass) {
    return `Biomassa insuficiente no lote/povoamento (id: ${insufficientBiomass.stockingId}). Disponível: ${insufficientBiomass.available} | Solicitado: ${insufficientBiomass.requested}`;
  }

  const closedStockingId = parseClosedStockingId(message);
  if (closedStockingId) {
    return `O povoamento (id: ${closedStockingId}) já foi encerrado. Não é possível registrar novas vendas.`;
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
