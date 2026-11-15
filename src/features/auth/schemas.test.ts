import { describe, expect, it } from 'vitest';
import { forgotPasswordSchema, loginSchema, resetPasswordSchema } from './schemas';

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

describe('recuperação de senha', () => {
  const base = {
    token: 't',
    email: 'a@b.com',
    password: 'Abcdef12',
    password_confirmation: 'Abcdef12',
  };

  it('forgotPasswordSchema valida e-mail', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.com' }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: 'x' }).success).toBe(false);
  });

  it('resetPasswordSchema exige 8+ caracteres e confirmação igual', () => {
    expect(resetPasswordSchema.safeParse(base).success).toBe(true);
    expect(
      resetPasswordSchema.safeParse({ ...base, password: 'abc', password_confirmation: 'abc' })
        .success,
    ).toBe(false);
    const r = resetPasswordSchema.safeParse({ ...base, password_confirmation: 'outra123' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].path).toEqual(['password_confirmation']);
  });

  it('resetPasswordSchema rejeita link sem token', () => {
    expect(resetPasswordSchema.safeParse({ ...base, token: '' }).success).toBe(false);
  });
});
