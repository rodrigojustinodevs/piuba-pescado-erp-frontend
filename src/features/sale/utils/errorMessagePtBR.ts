/**
 * Tradução de mensagens de erro da API de Sales (EN → PT-BR)
 * Estratégia:
 * 1. Normaliza mensagem
 * 2. Tenta match exato (O(1))
 * 3. Executa pipeline de translators (pattern-based)
 * 4. Fallback → mensagem original
 */

// ==============================
// NORMALIZATION
// ==============================

function normalizeMessage(message: string): string {
  return message?.trim?.().replace(/\.\.$/, '.') ?? '';
}

// ==============================
// STATUS MAPPING
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
// EXACT MATCH MAP (FAST PATH)
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
// HELPERS
// ==============================

type Translator = (message: string) => string | null;

/**
 * Extrai substring entre dois delimitadores (case insensitive)
 */
function extractBetween(message: string, start: string, end: string): string | null {
  const lower = message.toLowerCase();

  const s = lower.indexOf(start);
  const e = lower.indexOf(end);

  if (s === -1 || e === -1 || e <= s) return null;

  return message.slice(s + start.length, e).trim();
}

// ==============================
// TRANSLATORS PIPELINE
// ==============================

const translators: Translator[] = [
  // CPF/CNPJ ou endereço ausente
  (msg) => {
    const id = extractBetween(msg, 'the client (id:', ') does not have cpf/cnpj');

    if (!id) return null;

    return `O cliente (id: ${id}) não possui CPF/CNPJ e/ou endereço cadastrado.`;
  },

  // Crédito excedido
  (msg) => {
    const match = msg.match(
      /^the client \(id:(.+?)\) has exceeded the credit limit\. limit:(.+?)\| current exposure:(.+)$/i,
    );

    if (!match) return null;

    const [, clientId, limit, exposure] = match;

    return `O cliente (id: ${clientId.trim()}) excedeu o limite de crédito. Limite: ${limit.trim()} | Exposição atual: ${exposure.trim()}`;
  },

  // Biomassa insuficiente
  (msg) => {
    const match = msg.match(
      /^insufficient biomass in the batch\/stocking \(id:(.+?)\)\. available:(.+?)\| requested:(.+)$/i,
    );

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
    const m = msg.match(/^Company \[(.+?)\] not found/i);
    if (!m) return null;

    return `A empresa “${m[1].trim()}” não foi encontrada ou não está acessível.`;
  },

  // Transição de status
  (msg) => {
    const m = msg.match(/Cannot transition sale from \[?(.+?)\]?\s+to\s+\[?(.+?)\]?/i);

    if (!m) return null;

    return `Não é possível alterar o status da venda de “${statusLabelPt(
      m[1],
    )}” para “${statusLabelPt(m[2])}”.`;
  },

  // Regras numéricas
  (msg) => {
    const rules: Array<[RegExp, string]> = [
      [/total weight must be at least ([\d.,]+)/i, 'O peso total deve ser no mínimo %s.'],
      [
        /total weight may not be greater than ([\d.,]+)/i,
        'O peso total não pode ser maior que %s.',
      ],
      [/price per kg must be at least ([\d.,]+)/i, 'O preço por kg deve ser no mínimo %s.'],
      [
        /price per kg may not be greater than ([\d.,]+)/i,
        'O preço por kg não pode ser maior que %s.',
      ],
    ];

    for (const [regex, template] of rules) {
      const m = msg.match(regex);
      if (m) return template.replace('%s', m[1]);
    }

    return null;
  },

  // Laravel fallback (exists validation)
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

  // 1. Exact match (fast path)
  const exact = EXACT_MAP[normalized as keyof typeof EXACT_MAP];

  if (exact) return exact;

  // 2. Pipeline (dynamic rules)
  for (const translator of translators) {
    const result = translator(normalized);
    if (result) return result;
  }

  // 3. Fallback
  return message;
}
