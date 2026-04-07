/**
 * Tradução de mensagens de erro da API de Sales (EN → PT-BR)
 * Padrões aplicados:
 * - Regex seguras (anti-ReDoS)
 * - Uso de RegExp.exec()
 * - Pipeline de translators (extensível)
 * - Fast-path com EXACT_MAP
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
// EXACT MAP (FAST PATH)
// ==============================

const EXACT_MAP = Object.freeze({
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
} as const);

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
// REGEX (PRECOMPILED / SAFE)
// ==============================

/** Formato legado: id + limit + exposure */
const CREDIT_LIMIT_BY_ID_REGEX =
  /^the client \(id:(.+?)\) has exceeded the credit limit\. limit:(.+?)\| current exposure:(.+)$/i;

/** Formato atual: nome + limit + exposure + nova venda + total */
const CREDIT_LIMIT_BY_NAME_REGEX =
  /^the client \(name:\s*(.+?)\) has exceeded the credit limit\.\s*limit:\s*(.+?)\s*\|\s*current exposure:\s*(.+?)\s*\|\s*new sale:\s*(.+?)\s*\|\s*total:\s*(.+)$/i;

const BIOMASS_REGEX =
  /^insufficient biomass in the batch\/stocking \(id:(.+?)\)\. available:(.+?)\| requested:(.+)$/i;

const COMPANY_NOT_FOUND_REGEX = /^Company \[(.+?)\] not found/i;

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

// ==============================
// TRANSLATORS PIPELINE
// ==============================

const translators: Translator[] = [
  // CPF/CNPJ ou endereço
  (msg) => {
    const id = extractBetween(msg, 'the client (id:', ') does not have cpf/cnpj');

    if (!id) return null;

    return `O cliente (id: ${id}) não possui CPF/CNPJ e/ou endereço cadastrado.`;
  },

  // Crédito excedido (nome + detalhes da venda)
  (msg) => {
    const match = CREDIT_LIMIT_BY_NAME_REGEX.exec(msg);
    if (!match) return null;

    const [, name, limit, exposure, newSale, total] = match;

    return `O cliente (nome: ${name.trim()}) excedeu o limite de crédito. Limite: ${limit.trim()} | Exposição atual: ${exposure.trim()} | Nova venda: ${newSale.trim()} | Total: ${total.trim()}`;
  },

  // Crédito excedido (id — legado)
  (msg) => {
    const match = CREDIT_LIMIT_BY_ID_REGEX.exec(msg);
    if (!match) return null;

    const [, clientId, limit, exposure] = match;

    return `O cliente (id: ${clientId.trim()}) excedeu o limite de crédito. Limite: ${limit.trim()} | Exposição atual: ${exposure.trim()}`;
  },

  // Biomassa
  (msg) => {
    const match = BIOMASS_REGEX.exec(msg);
    if (!match) return null;

    const [, id, available, requested] = match;

    return `Biomassa insuficiente no lote/povoamento (id: ${id.trim()}). Disponível: ${available.trim()} | Solicitado: ${requested.trim()}`;
  },

  // Povoamento encerrado
  (msg) => {
    const id = extractBetween(msg, 'the stocking (id:', ') has already been closed');

    if (!id) return null;

    return `O povoamento (id: ${id}) já foi encerrado. Não é possível registrar novas vendas.`;
  },

  // Empresa não resolvida
  (msg) => {
    if (/^Could not resolve a company/i.test(msg)) {
      return 'Não foi possível identificar a empresa para esta operação.';
    }
    return null;
  },

  // Empresa não encontrada
  (msg) => {
    const match = COMPANY_NOT_FOUND_REGEX.exec(msg);
    if (!match) return null;

    return `A empresa “${match[1].trim()}” não foi encontrada ou não está acessível.`;
  },

  // Transição de status (SAFE)
  (msg) => {
    const match = TRANSITION_REGEX.exec(msg);
    if (!match) return null;

    const [, from, to] = match;

    return `Não é possível alterar o status da venda de “${statusLabelPt(
      from,
    )}” para “${statusLabelPt(to)}”.`;
  },

  // Regras numéricas
  (msg) => {
    for (const [regex, template] of NUMERIC_RULES) {
      const match = regex.exec(msg);
      if (match) {
        return template.replace('%s', match[1]);
      }
    }
    return null;
  },

  // Laravel fallback
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
// MAIN FUNCTION
// ==============================

export function translateSaleApiErrorMessagePtBR(message: string): string {
  const normalized = normalizeMessage(message);

  if (!normalized) return message;

  // Fast path
  const exact = EXACT_MAP[normalized as keyof typeof EXACT_MAP];

  if (exact) return exact;

  // Pipeline
  for (const translator of translators) {
    const result = translator(normalized);
    if (result) return result;
  }

  // Fallback
  return message;
}
