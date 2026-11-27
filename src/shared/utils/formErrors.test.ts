import { describe, expect, it, vi } from 'vitest';
import { HttpError } from '@/shared/lib/http/httpError';
import { applyServerFieldErrors, hasServerFieldErrors } from './formErrors';

describe('applyServerFieldErrors', () => {
  it('marca cada campo com a primeira mensagem e foca o primeiro', () => {
    const setError = vi.fn();
    const error = new HttpError('The location is required.', 422, {
      location: ['The location is required.'],
      name: ['The name is too short.', 'outra'],
    });

    expect(hasServerFieldErrors(error)).toBe(true);
    expect(applyServerFieldErrors(error, setError)).toBe(true);
    expect(setError).toHaveBeenNthCalledWith(
      1,
      'location',
      { type: 'server', message: 'The location is required.' },
      { shouldFocus: true },
    );
    expect(setError).toHaveBeenNthCalledWith(
      2,
      'name',
      { type: 'server', message: 'The name is too short.' },
      { shouldFocus: false },
    );
  });

  it('ignora erro sem fieldErrors ou que não é HttpError', () => {
    const setError = vi.fn();
    expect(applyServerFieldErrors(new HttpError('Falhou', 500), setError)).toBe(false);
    expect(applyServerFieldErrors(new Error('x'), setError)).toBe(false);
    expect(hasServerFieldErrors(new HttpError('Falhou', 422, {}))).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });

  it('usa o businessField quando o 422 não traz fieldErrors', () => {
    const setError = vi.fn();
    const error = new HttpError('Documento inválido', 422);
    expect(applyServerFieldErrors(error, setError, { field: 'document', match: /Documento/ })).toBe(
      true,
    );
    expect(setError).toHaveBeenCalledWith(
      'document',
      { type: 'server', message: 'Documento inválido' },
      { shouldFocus: true },
    );
  });
});
