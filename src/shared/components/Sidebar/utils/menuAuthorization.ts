import type { AuthenticatedUser as User } from '@/shared/types/auth';
import { UserRole } from '@/shared/types/auth';
import type { MenuItemWithAuth } from '../menuConfig';
import type { MenuItem } from '../types';

function getUserRoleVariants(role?: string): string[] {
  if (!role) return [];
  return [role, role.replaceAll('-', '_')];
}

function isMasterUser(user: User | null): boolean {
  if (!user?.role) return false;
  const roles = getUserRoleVariants(user.role);
  return roles.includes(UserRole.MASTER);
}

function hasRequiredRole(user: User, allowedRoles: string[]): boolean {
  const userRoles = getUserRoleVariants(user.role);
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function canShowMenuItem(menuItem: MenuItemWithAuth, user: User | null): boolean {
  if (isMasterUser(user)) {
    return true;
  }

  if (menuItem.requiresCompany && !user?.companyId) {
    return false;
  }

  const hasRoleRestrictions =
    Array.isArray(menuItem.allowedRoles) && menuItem.allowedRoles.length > 0;
  if (!hasRoleRestrictions) {
    return true;
  }

  if (!user?.role) {
    return false;
  }

  return hasRequiredRole(user, menuItem.allowedRoles!);
}

export function filterMenuItemsByAuth(
  menuItems: MenuItemWithAuth[],
  user: User | null,
): MenuItemWithAuth[] {
  return menuItems.reduce<MenuItemWithAuth[]>((acc, item) => {
    const filteredChildren = item.children ? filterMenuItemsByAuth(item.children, user) : undefined;

    const isVisible = canShowMenuItem(item, user);

    const hasChildrenOriginal = item.children && item.children.length > 0;
    const hasChildrenRemaining = filteredChildren && filteredChildren.length > 0;

    if (hasChildrenOriginal && !hasChildrenRemaining) {
      return acc;
    }

    if (isVisible) {
      acc.push({
        ...item,
        children: filteredChildren,
      });
    }

    return acc;
  }, []);
}

export function toMenuItem(menuItem: MenuItemWithAuth): MenuItem {
  const { allowedRoles, requiresCompany, children, ...uiProps } = menuItem;
  void allowedRoles;
  void requiresCompany;
  return {
    ...uiProps,
    children: children?.map(toMenuItem),
  };
}
