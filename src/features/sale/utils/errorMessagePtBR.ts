/**
 * Tradução de mensagens de erro da API de Sales (EN → PT-BR)
 * HARDENING:
 * - Anti-ReDoS (sem backtracking exponencial)
 * - Regex restritivas por delimitador
 * - Uso de RegExp.exec()
 * - Pipeline extensível
 */

// ==============================
// NORMALIZATION
// ==============================

function normalizeMessage(message: string): string {
  return message?.trim?.().replace(/\.\.$/, '.') ?? '';
}

// ==============================
// STATUS
// ==============================

const SALE_STATUS_LABEL_PT = {
  pending: 'pendente',
  confirmed: 'confirmado',
  cancelled: 'cancelado',
} as const;

function statusLabelPt(value: string): string {
  return (
    SALE_STATUS_LABEL_PT[value.trim().toLowerCase() as keyof typeof SALE_STATUS_LABEL_PT] ?? value
  );
}

// ==============================
// EXACT MAP
// ==============================

const EXACT_MAP: Record<string, string> = Object.freeze({
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

  'The notes must not exceed 1000 characters.':
    'As observações não podem ter mais de 1000 caracteres.',

  'It is not possible to edit the values of a sale with registered receipts.':
    'Não é possível alterar os valores de uma venda com recebimentos registrados.',

  'The company id must be a valid UUID.': 'O ID da empresa deve ser um UUID válido.',

  'The selected company id is invalid.': 'A empresa selecionada não existe.',

  'The selected company does not exist.': 'A empresa selecionada não existe.',
});

// ==============================
// TYPES
// ==============================

type Translator = (message: string) => string | null;

// ==============================
// HELPERS
// ==============================

function extractBetween(message: string, start: string, end: string): string | null {
  const lower = message.toLowerCase();

  const s = lower.indexOf(start);
  const e = lower.indexOf(end);

  if (s === -1 || e === -1 || e <= s) return null;

  return message.slice(s + start.length, e).trim();
}

// ==============================
// REGEX (SAFE)
// ==============================

const COMPANY_NOT_FOUND_REGEX = /^Company \[([^\]]+)\] not found/i;

const TRANSITION_REGEX =
  /^Cannot transition sale from \[?(pending|confirmed|cancelled)\]?\s+to\s+\[?(pending|confirmed|cancelled)\]?\.?$/i;

const NUMERIC_RULES: Array<[RegExp, string]> = [
  [/^The total weight must be at least ([\d.,]+)\.?$/i, 'O peso total deve ser no mínimo %s.'],
  [
    /^The total weight may not be greater than ([\d.,]+)\.?$/i,
    'O peso total não pode ser maior que %s.',
  ],
  [/^The price per kg must be at least ([\d.,]+)\.?$/i, 'O preço por kg deve ser no mínimo %s.'],
  [
    /^The price per kg may not be greater than ([\d.,]+)\.?$/i,
    'O preço por kg não pode ser maior que %s.',
  ],
];

function parseCreditLimitByName(message: string): {
  name: string;
  limit: string;
  exposure: string;
  newSale: string;
  total: string;
} | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'the client (name:';
  const middle = ') has exceeded the credit limit.';
  const limitTag = 'limit:';
  const exposureTag = '| current exposure:';
  const newSaleTag = '| new sale:';
  const totalTag = '| total:';

  if (!lower.startsWith(prefix)) return null;

  const middleIdx = lower.indexOf(middle);
  if (middleIdx < 0) return null;

  const name = source.slice(prefix.length, middleIdx).trim();
  if (!name) return null;

  const details = source.slice(middleIdx + middle.length).trim();
  const detailsLower = details.toLowerCase();
  if (!detailsLower.startsWith(limitTag)) return null;

  const exposureIdx = detailsLower.indexOf(exposureTag);
  if (exposureIdx < 0) return null;
  const newSaleIdx = detailsLower.indexOf(newSaleTag, exposureIdx + exposureTag.length);
  if (newSaleIdx < 0) return null;
  const totalIdx = detailsLower.indexOf(totalTag, newSaleIdx + newSaleTag.length);
  if (totalIdx < 0) return null;

  const limit = details.slice(limitTag.length, exposureIdx).trim();
  const exposure = details.slice(exposureIdx + exposureTag.length, newSaleIdx).trim();
  const newSale = details.slice(newSaleIdx + newSaleTag.length, totalIdx).trim();
  const total = details.slice(totalIdx + totalTag.length).trim();
  if (!limit || !exposure || !newSale || !total) return null;

  return { name, limit, exposure, newSale, total };
}

function parseCreditLimitById(message: string): { id: string; limit: string; exposure: string } | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'the client (id:';
  const middle = ') has exceeded the credit limit.';
  const limitTag = 'limit:';
  const exposureTag = '| current exposure:';

  if (!lower.startsWith(prefix)) return null;

  const middleIdx = lower.indexOf(middle);
  if (middleIdx < 0) return null;

  const id = source.slice(prefix.length, middleIdx).trim();
  if (!id) return null;

  const details = source.slice(middleIdx + middle.length).trim();
  const detailsLower = details.toLowerCase();
  if (!detailsLower.startsWith(limitTag)) return null;

  const exposureIdx = detailsLower.indexOf(exposureTag);
  if (exposureIdx < 0) return null;

  const limit = details.slice(limitTag.length, exposureIdx).trim();
  const exposure = details.slice(exposureIdx + exposureTag.length).trim();
  if (!limit || !exposure) return null;

  return { id, limit, exposure };
}

function parseInsufficientBiomass(message: string): {
  id: string;
  available: string;
  requested: string;
} | null {
  const source = message.trim();
  const lower = source.toLowerCase();
  const prefix = 'insufficient biomass in the batch/stocking (id:';
  const middle = ').';
  const availableTag = 'available:';
  const requestedTag = '| requested:';

  if (!lower.startsWith(prefix)) return null;

  const middleIdx = lower.indexOf(middle);
  if (middleIdx < 0) return null;

  const id = source.slice(prefix.length, middleIdx).trim();
  if (!id) return null;

  const details = source.slice(middleIdx + middle.length).trim();
  const detailsLower = details.toLowerCase();
  if (!detailsLower.startsWith(availableTag)) return null;

  const requestedIdx = detailsLower.indexOf(requestedTag);
  if (requestedIdx < 0) return null;

  const available = details.slice(availableTag.length, requestedIdx).trim();
  const requested = details.slice(requestedIdx + requestedTag.length).trim();
  if (!available || !requested) return null;

  return { id, available, requested };
}

// ==============================
// TRANSLATORS
// ==============================

const translators: Translator[] = [
  (msg) => {
    if (msg.length > 2000) return null;
    return null;
  },

  (msg) => {
    const id = extractBetween(msg, 'the client (id:', ') does not have cpf/cnpj');

    if (!id) return null;

    return `O cliente (id: ${id}) não possui CPF/CNPJ e/ou endereço cadastrado.`;
  },

  (msg) => {
    const parsed = parseCreditLimitByName(msg);
    if (!parsed) return null;

    return `O cliente (nome: ${parsed.name}) excedeu o limite de crédito. Limite: ${parsed.limit} | Exposição atual: ${parsed.exposure} | Nova venda: ${parsed.newSale} | Total: ${parsed.total}`;
  },

  (msg) => {
    const parsed = parseCreditLimitById(msg);
    if (!parsed) return null;

    return `O cliente (id: ${parsed.id}) excedeu o limite de crédito. Limite: ${parsed.limit} | Exposição atual: ${parsed.exposure}`;
  },

  (msg) => {
    const parsed = parseInsufficientBiomass(msg);
    if (!parsed) return null;

    return `Biomassa insuficiente no lote/povoamento (id: ${parsed.id}). Disponível: ${parsed.available} | Solicitado: ${parsed.requested}`;
  },

  (msg) => {
    const id = extractBetween(msg, 'the stocking (id:', ') has already been closed');

    if (!id) return null;

    return `O povoamento (id: ${id}) já foi encerrado.`;
  },

  (msg) => {
    if (/^Could not resolve a company/i.test(msg)) {
      return 'Não foi possível identificar a empresa.';
    }
    return null;
  },

  (msg) => {
    const match = COMPANY_NOT_FOUND_REGEX.exec(msg);
    if (!match) return null;

    return `A empresa “${match[1].trim()}” não foi encontrada.`;
  },

  (msg) => {
    const match = TRANSITION_REGEX.exec(msg);
    if (!match) return null;

    const [, from, to] = match;

    return `Não é possível alterar o status da venda de “${statusLabelPt(
      from,
    )}” para “${statusLabelPt(to)}”.`;
  },

  (msg) => {
    for (const [regex, template] of NUMERIC_RULES) {
      const match = regex.exec(msg);
      if (match) {
        return template.replace('%s', match[1]);
      }
    }
    return null;
  },

  (msg) => {
    const map: Record<string, string> = {
      'The selected client id is invalid.': 'O cliente informado não foi encontrado.',
      'The selected batch id is invalid.': 'O lote informado não foi encontrado.',
      'The selected stocking id is invalid.': 'O povoamento informado não foi encontrado.',
      'The selected financial category id is invalid.':
        'A categoria financeira informada não foi encontrada.',
    };

    return map[msg] ?? null;
  },
];

// ==============================
// MAIN
// ==============================

export function translateSaleApiErrorMessagePtBR(message: string): string {
  const normalized = normalizeMessage(message);

  if (!normalized) return message;

  const exact = EXACT_MAP[normalized as keyof typeof EXACT_MAP];

  if (exact) return exact;

  for (const translator of translators) {
    const result = translator(normalized);
    if (result) return result;
  }

  return message;
}
