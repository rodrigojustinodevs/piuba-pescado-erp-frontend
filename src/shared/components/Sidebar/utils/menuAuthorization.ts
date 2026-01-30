import type { User } from "@/features/auth/types";
import { UserRole } from "@/shared/types/auth";
import type { MenuItemWithAuth } from "../menuConfig";
import type { MenuItem } from "../types";

export function canShowMenuItem(
  menuItem: MenuItemWithAuth,
  user: User | null
): boolean {
  
  // Normaliza o role do usuário (converte hífen para underscore se necessário)
  const normalizedUserRole = user?.role?.replace(/-/g, "_");
  const userRoleValue = normalizedUserRole || user?.role;
  
  console.log("🔍 [Menu Auth] Verificando item:", {
    menuItemId: menuItem.id,
    menuItemLabel: menuItem.label,
    userRole: user?.role,
    normalizedUserRole: userRoleValue,
    allowedRoles: menuItem.allowedRoles,
    requiresCompany: menuItem.requiresCompany,
    userCompanyId: user?.companyId,
  });
  
  if (userRoleValue === UserRole.MASTER || user?.role === UserRole.MASTER) {
    console.log("✅ [Menu Auth] Usuário MASTER - acesso liberado");
    return true;
  }
  
  if (menuItem.requiresCompany && !user?.companyId) {
    console.log("🚫 [Menu Auth] Item requer companyId mas usuário não tem");
    return false;
  }
  
  if (!menuItem.allowedRoles) {
    console.log("✅ [Menu Auth] Item sem restrição de roles");
    return true;
  }
  
  if (menuItem.allowedRoles.length === 0) {
    console.log("🚫 [Menu Auth] Item com array vazio de allowedRoles");
    return false;
  }
  
  if (!user?.role) {
    console.log("🚫 [Menu Auth] Usuário sem role definido");
    return false;
  }
  
  // Verifica tanto o role original quanto o normalizado
  const hasAccess = menuItem.allowedRoles.includes(user.role) || 
                    (userRoleValue ? menuItem.allowedRoles.includes(userRoleValue) : false);
  
  console.log(hasAccess ? "✅ [Menu Auth] Acesso permitido" : "🚫 [Menu Auth] Acesso negado");
  
  return hasAccess;
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

      if (filteredChildren && filteredChildren.length === 0 && item.children && item.children.length > 0) {
        console.log(`🚫 [Menu Auth] Item "${item.id}" negado: todos os filhos foram filtrados`);
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



