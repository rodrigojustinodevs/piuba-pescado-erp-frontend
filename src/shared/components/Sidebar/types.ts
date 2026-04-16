/**
 * Tipos para o menu lateral
 */

import { LucideIcon } from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: MenuItem[];
}

export interface SidebarProps {
  items: MenuItem[];
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onCollapseToggle?: () => void;
  logo?: React.ReactNode;
  user?: {
    name: string;
    email: string;
    /**
     * Texto secundário exibido abaixo do nome.
     * Se não informado, usa o email.
     */
    subtitle?: string;
    avatar?: string;
  };
}
