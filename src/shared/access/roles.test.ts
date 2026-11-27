import { describe, expect, it } from 'vitest';
import {
  hasPermission,
  isAtLeast,
  normalizeRole,
  rolesAtLeast,
  rolesWithPermission,
} from './roles';

describe('papéis', () => {
  it('hierarquia operator < manager < admin < company_admin; master passa', () => {
    expect(isAtLeast('operator', 'manager')).toBe(false);
    expect(isAtLeast('manager', 'manager')).toBe(true);
    expect(isAtLeast('company_admin', 'admin')).toBe(true);
    expect(isAtLeast('master', 'company_admin')).toBe(true);
    expect(isAtLeast(undefined, 'operator')).toBe(false);
    expect(isAtLeast('guest', 'operator')).toBe(false);
  });

  it('normaliza variações do papel', () => {
    expect(normalizeRole('company-admin')).toBe('company_admin');
    expect(normalizeRole('master')).toBe('master_admin');
    expect(normalizeRole('qualquer')).toBeNull();
  });

  it('segue a matriz da API', () => {
    expect(hasPermission('operator', 'generate-management-plan')).toBe(true);
    expect(hasPermission('operator', 'review-management-plan')).toBe(false);
    expect(hasPermission('manager', 'cancel-sale')).toBe(true);
    expect(hasPermission('manager', 'view-financial-report')).toBe(false);
    expect(hasPermission('admin', 'delete-sale')).toBe(false);
    expect(hasPermission('company_admin', 'delete-sale')).toBe(true);
    expect(hasPermission('company_admin', 'edit-company')).toBe(true);
    expect(hasPermission('admin', 'edit-company')).toBe(false);
    expect(hasPermission('master_admin', 'delete-company')).toBe(true);
  });

  it('listas derivadas para menu/shells', () => {
    expect(rolesWithPermission('view-financial-report')).toEqual([
      'master',
      'master_admin',
      'admin',
      'company_admin',
    ]);
    expect(rolesAtLeast('admin')).toEqual(['master', 'master_admin', 'admin', 'company_admin']);
  });
});
