/**
 * Mensagens de erro exibidas ao usuário, sempre em português.
 * O backend pode continuar retornando em inglês; o frontend mapeia por status/código
 * e exibe estas mensagens, centralizando a experiência do usuário.
 */
export const ErrorMessages = {
  LOGIN_CREDENTIALS:
    'Erro de credenciais ao realizar login. Verifique e-mail e senha e tente novamente.',

  LOGIN_REQUIRED_FIELDS: 'E-mail e senha são obrigatórios.',

  LOGIN_SERVER_ERROR: 'Erro ao conectar com o servidor. Tente novamente.',

  UNAUTHORIZED: 'Não autenticado.',

  SERVER_CONNECTION: 'Erro ao conectar com o servidor. Tente novamente.',

  SERVER_FAILURE: 'Falha na comunicação com o servidor.',

  UNEXPECTED: 'Ocorreu um erro inesperado.',
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessages;
