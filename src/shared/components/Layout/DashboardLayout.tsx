'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '../Sidebar/Sidebar';
import { menuGroupsConfig } from '../Sidebar/menuConfig';
import { useMenuGroupsAuthorization } from '../Sidebar/hooks/useMenuGroupsAuthorization';
import { TenantSwitcher } from '../Sidebar/TenantSwitcher';
import { SidebarUserFooter } from '../Sidebar/SidebarUserFooter';
import { Header, type HeaderProps } from '../Header';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/Collapsible';
import type { MenuItem, NavGroup, SidebarProps } from '../Sidebar/types';

// Item ativo: faixa turquesa que some para a direita + barrinha turquesa à esquerda.
const MENU_BUTTON_CLASS = [
  'relative h-10 gap-3 px-3 [&>svg]:size-4.5',
  'data-[active=true]:bg-transparent data-[active=true]:bg-linear-to-r',
  'data-[active=true]:from-sidebar-primary/30 data-[active=true]:to-transparent',
  'data-[active=true]:before:absolute data-[active=true]:before:inset-y-2',
  'data-[active=true]:before:left-0 data-[active=true]:before:w-1',
  'data-[active=true]:before:rounded-r data-[active=true]:before:bg-sidebar-primary',
].join(' ');

function renderMenuIcon(icon?: MenuItem['icon']) {
  if (!icon) return null;

  const Icon = icon;
  return <Icon aria-hidden="true" className="size-4.5" />;
}
interface DashboardLayoutProps {
  children: React.ReactNode;
  /** Sobrescreve os grupos do menu (sem filtro de autorização). */
  menuGroups?: NavGroup[];
  user?: NonNullable<SidebarProps['user']>;
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
          <SidebarMenuButton
            tooltip={item.label}
            isActive={hasActiveChild}
            className={MENU_BUTTON_CLASS}
          >
            {renderMenuIcon(item.icon)}
            <span className="flex-1">{item.label}</span>
            <ChevronRight
              aria-hidden="true"
              className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="ml-4 mt-1 gap-1 py-1 pl-3">
            {item.children?.map((child) => (
              <SidebarMenuSubItem key={child.id}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathname === child.href}
                  className="h-9 px-3"
                >
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
      <SidebarMenuButton
        asChild
        isActive={active}
        tooltip={item.label}
        className={MENU_BUTTON_CLASS}
      >
        <Link href={item.href ?? '/'} className="transition-colors duration-150">
          {renderMenuIcon(item.icon)}
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function DashboardLayout({ children, menuGroups, headerProps }: Readonly<DashboardLayoutProps>) {
  // Filtra os grupos de menu baseado nas permissões do usuário
  const authorizedMenuGroups = useMenuGroupsAuthorization(menuGroupsConfig);
  // Se menuGroups for passado como prop, usa ele diretamente (sem filtro de autorização)
  const menuGroupsToUse = menuGroups ?? authorizedMenuGroups;

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <DashboardSidebar menuGroups={menuGroupsToUse} />

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
  readonly menuGroups: NavGroup[];
}

function DashboardSidebar({ menuGroups }: Readonly<DashboardSidebarProps>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4 group-data-[collapsible=icon]:px-2">
        <TenantSwitcher />
      </SidebarHeader>
      <SidebarContent className="gap-2 px-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.id} className="p-0 py-2">
            <SidebarGroupLabel className="mb-1 h-auto px-3 text-[11px] uppercase tracking-wider text-sidebar-foreground/50">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) =>
                  item.children && item.children.length > 0 ? (
                    <SidebarItemWithChildren key={item.id} item={item} pathname={pathname} />
                  ) : (
                    <SidebarItemSimple key={item.id} item={item} pathname={pathname} />
                  ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarUserFooter />
    </Sidebar>
  );
}
