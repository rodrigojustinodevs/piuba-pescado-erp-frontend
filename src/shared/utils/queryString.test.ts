import { describe, expect, it } from 'vitest';
import { buildQueryString } from './queryString';

describe('buildQueryString', () => {
  it('omite null e undefined', () => {
    expect(buildQueryString({ page: 1, search: undefined, a: null })).toBe('page=1');
  });

  it('mantém string vazia por padrão e remove com skipEmptyString', () => {
    expect(buildQueryString({ search: '' })).toBe('search=');
    expect(buildQueryString({ search: '' }, { skipEmptyString: true })).toBe('');
  });

  it('codifica valores', () => {
    expect(buildQueryString({ search: 'a b&c' })).toBe('search=a+b%26c');
  });
});
