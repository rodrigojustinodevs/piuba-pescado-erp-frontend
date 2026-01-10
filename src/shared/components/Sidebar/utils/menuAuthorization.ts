import type { User } from "@/features/auth/types";
import { UserRole } from "@/shared/types/auth";
import type { MenuItemWithAuth } from "../menuConfig";
import type { MenuItem } from "../types";

export function canShowMenuItem(
  menuItem: MenuItemWithAuth,
  user: User | null
): boolean {
  if (!user) return false;
  
  if (user.role === UserRole.MASTER) {
    return true;
  }
  
  if (menuItem.requiresCompany && !user.companyId) return false;
  if (!menuItem.allowedRoles) return true;
  if (menuItem.allowedRoles.length === 0) return false;
  if (!user.role) return false;
  return menuItem.allowedRoles.includes(user.role);
}

export function filterMenuItemsByAuth(
  menuItems: MenuItemWithAuth[],
  user: User | null
): MenuItemWithAuth[] {
  return menuItems
    .map((item) => {
      const filteredChildren = item.children
        ? filterMenuItemsByAuth(item.children, user)
        : undefined;

      const itemWithFilteredChildren: MenuItemWithAuth = {
        ...item,
        children: filteredChildren,
      };

      const canShow = canShowMenuItem(itemWithFilteredChildren, user);

      if (filteredChildren && filteredChildren.length === 0 && item.children) {
        return null;
      }

      return canShow ? itemWithFilteredChildren : null;
    })
    .filter((item): item is MenuItemWithAuth => item !== null);
}

export function toMenuItem(menuItem: MenuItemWithAuth): MenuItem {
  const { allowedRoles, requiresCompany, ...menuItemWithoutAuth } = menuItem;
  return {
    ...menuItemWithoutAuth,
    children: menuItem.children?.map(toMenuItem),
  };
}



