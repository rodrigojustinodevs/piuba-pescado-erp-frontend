'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from '../Sidebar/Sidebar';
import { menuConfig } from '../Sidebar/menuConfig';
import { useMenuAuthorization } from '../Sidebar/hooks/useMenuAuthorization';
import { Header, type HeaderProps } from '../Header';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/Collapsible';
import type { MenuItem, SidebarProps } from '../Sidebar/types';

function renderMenuIcon(icon?: MenuItem['icon']) {
  if (!icon) return null;

  const Icon = icon;
  return <Icon className="h-4 w-4" />;
}
interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems?: SidebarProps['items'];
  user?: SidebarProps['user'];
  headerProps?: HeaderProps;
}

interface SidebarItemNavProps {
  readonly item: MenuItem;
  readonly pathname: string;
}

function SidebarItemWithChildren({ item, pathname }: Readonly<SidebarItemNavProps>) {
  const hasActiveChild = item.children?.some((child) => child.href === pathname) ?? false;

  return (
    <Collapsible defaultOpen={hasActiveChild} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.label} isActive={hasActiveChild}>
            {renderMenuIcon(item.icon)}
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                  <Link href={child.href ?? '/'} className="transition-colors duration-150">
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarItemSimple({ item, pathname }: Readonly<SidebarItemNavProps>) {
  const active = pathname === item.href;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
        <Link href={item.href ?? '/'} className="transition-colors duration-150">
          {renderMenuIcon(item.icon)}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DashboardLayout({ children, menuItems, headerProps }: DashboardLayoutProps) {
  // Filtra itens de menu baseado nas permissões do usuário
  const authorizedMenuItems = useMenuAuthorization(menuConfig);
  // Se menuItems for passado como prop, usa ele diretamente (sem filtro de autorização)
  const menuItemsToUse = menuItems ?? authorizedMenuItems;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <DashboardSidebar menuItems={menuItemsToUse} />

        {/* Área principal: SidebarInset é o par peer do Sidebar (shadcn) e ocupa o restante da largura */}
        <SidebarInset className="min-h-0 flex-1 flex-col overflow-hidden">
          <Header {...headerProps} />

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f9fafb]">
            <div className="w-full p-4 lg:p-8">{children}</div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

interface DashboardSidebarProps {
  readonly menuItems: SidebarProps['items'];
}

function DashboardSidebar({ menuItems }: Readonly<DashboardSidebarProps>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-2 ">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={`flex shrink-0 items-center justify-center transition-all duration-200 ${
              isCollapsed ? 'h-8 w-8' : 'h-10.5 w-10.5'
            }`}
          >
            <Image
              src="/icone-piuba-pescados.svg"
              alt="Piúba Pescado"
              width={42}
              height={42}
              className="h-full w-full"
            />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Piúba Pescado
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                item.children && item.children.length > 0 ? (
                  <SidebarItemWithChildren key={item.id} item={item} pathname={pathname} />
                ) : (
                  <SidebarItemSimple key={item.id} item={item} pathname={pathname} />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
