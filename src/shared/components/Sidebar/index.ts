/**
 * Exportações do módulo Sidebar
 */

export { Sidebar } from './Sidebar';
export {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from './Sidebar';
export type { SidebarProps, MenuItem } from './types';
export { MenuItem as MenuItemComponent } from './MenuItem';
export { Dropdown } from './Dropdown';

// Exportações relacionadas a autorização de menu
export { menuConfig } from './menuConfig';
export type { MenuItemWithAuth } from './menuConfig';
export { useMenuAuthorization } from './hooks/useMenuAuthorization';
export { canShowMenuItem, filterMenuItemsByAuth, toMenuItem } from './utils/menuAuthorization';
