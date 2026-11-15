import { describe, expect, it } from 'vitest';
import { maskCpfCnpj } from './documentMask';
import { maskPhone } from './phoneMask';

describe('maskCpfCnpj', () => {
  it('formata CPF progressivamente', () => {
    expect(maskCpfCnpj('123')).toBe('123');
    expect(maskCpfCnpj('1234')).toBe('123.4');
    expect(maskCpfCnpj('12345678901')).toBe('123.456.789-01');
  });

  it('formata CNPJ quando passa de 11 dígitos', () => {
    expect(maskCpfCnpj('12345678000195')).toBe('12.345.678/0001-95');
  });

  it('ignora caracteres não numéricos e limita a 14 dígitos', () => {
    expect(maskCpfCnpj('12.345.678/0001-95999')).toBe('12.345.678/0001-95');
    expect(maskCpfCnpj('abc')).toBe('');
  });
});

describe('maskPhone', () => {
  it('formata fixo e celular', () => {
    expect(maskPhone('1133334444')).toBe('(11) 3333-4444');
    expect(maskPhone('11999998888')).toBe('(11) 99999-8888');
  });

  it('lida com entrada parcial e vazia', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone('1')).toBe('(1');
    expect(maskPhone('119')).toBe('(11) 9');
  });
});
