import { Search, Bell } from 'lucide-react';
import { InputHeader } from '@/shared/components/ui/InputHeader';
import { Button } from '@/shared/components/ui/Button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/Avatar';
import { SidebarTrigger } from '@/shared/components/Sidebar/Sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/DropdownMenu/dropdown-menu';
import { Badge } from '@/shared/components/ui/Badge';
import { useAuthContext } from '@/shared/contexts/AuthContext';

export interface HeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: HeaderProps = {}) {
  const { user, logout } = useAuthContext();
  const name = user?.name || 'Usuário';

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4">
      <SidebarTrigger className="-ml-1" onClick={onMenuClick} />

      <div className="relative ml-auto flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <InputHeader type="search" placeholder="Buscar..." className="pl-8 h-9" />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">{name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => void logout()}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
