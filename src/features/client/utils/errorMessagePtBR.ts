const EXACT_MAP: Record<string, string> = {
  'The company ID must be a valid UUID.': 'O ID da empresa deve ser um UUID válido.',
  'The selected company does not exist.': 'A empresa selecionada não existe.',

  'The client name is required.': 'O nome do cliente é obrigatório.',
  'The name must be a string.': 'O nome deve ser um texto.',
  'The name may not be greater than 255 characters.': 'O nome não pode ter mais de 255 caracteres.',

  'The contact must be a string.': 'O contato deve ser um texto.',
  'The contact may not be greater than 255 characters.': 'O contato não pode ter mais de 255 caracteres.',

  'The phone must be a string.': 'O telefone deve ser um texto.',
  'The phone may not be greater than 20 characters.': 'O telefone não pode ter mais de 20 caracteres.',

  'The email must be a valid email address.': 'O e-mail deve ser um endereço válido.',
  'The email may not be greater than 255 characters.': 'O e-mail não pode ter mais de 255 caracteres.',

  'The person type is required.': 'O tipo de pessoa é obrigatório.',
  'The person type must be a string.': 'O tipo de pessoa deve ser um texto.',
  'The person type must be either "individual" or "company".':
    'O tipo de pessoa deve ser "Pessoa física" ou "Pessoa jurídica".',

  'This CPF/CNPJ is already registered for this company.':
    'Este CPF/CNPJ já está cadastrado para esta empresa.',
  'This CPF/CNPJ is already registered for this company..':
    'Este CPF/CNPJ já está cadastrado para esta empresa.',

  'The address must be a string.': 'O endereço deve ser um texto.',
  'The address may not be greater than 255 characters.': 'O endereço não pode ter mais de 255 caracteres.',

  'The credit limit must be a numeric value.': 'O limite de crédito deve ser um número.',
  'The credit limit cannot be negative.': 'O limite de crédito não pode ser negativo.',

  'The price group must be a string.': 'O grupo de preço deve ser um texto.',
  'The price group must be: wholesale, retail or consumer.':
    'O grupo de preço deve ser: atacado, varejo ou consumidor.',
};

export function translateClientApiErrorMessagePtBR(message: string): string {
  const normalized = message?.trim?.() ?? '';
  if (!normalized) return message;

  // Corrige variações comuns (ponto extra no final, espaços, etc.)
  const withoutDoubleDot = normalized.replace(/\.\.$/, '.');
  return EXACT_MAP[normalized] ?? EXACT_MAP[withoutDoubleDot] ?? message;
}

