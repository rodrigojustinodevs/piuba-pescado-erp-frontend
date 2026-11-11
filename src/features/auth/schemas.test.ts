import { describe, expect, it } from 'vitest';
import { loginSchema } from './schemas';

describe('loginSchema', () => {
  it('aceita credenciais válidas', () => {
    expect(loginSchema.safeParse({ email: 'a@b.com', password: '123456' }).success).toBe(true);
  });

  it('retorna mensagens em pt-BR', () => {
    const messages = (data: unknown) => {
      const r = loginSchema.safeParse(data);
      return r.success ? [] : r.error.issues.map((i) => i.message);
    };
    expect(messages({ email: '', password: '123456' })).toContain('E-mail é obrigatório');
    expect(messages({ email: 'teste', password: '123456' })).toContain('E-mail inválido');
    expect(messages({ email: 'a@b.com', password: '123' })).toContain(
      'Senha deve ter no mínimo 6 caracteres',
    );
  });
});
