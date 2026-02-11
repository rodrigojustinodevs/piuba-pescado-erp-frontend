/**
 * Tipos para o menu lateral
 */

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
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

