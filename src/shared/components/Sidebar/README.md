# 📋 Componente Sidebar - Menu Lateral

Componente de menu lateral responsivo com suporte a dropdowns e navegação.

## 🚀 Uso Básico

```tsx
import { DashboardLayout } from '@/shared/components/Layout';
import { defaultMenuItems } from '@/shared/components/Sidebar/menuItems';

export default function MinhaPage() {
  return (
    <DashboardLayout
      user={{
        name: 'João Silva',
        email: 'joao@exemplo.com',
      }}
    >
      <div>Conteúdo da página</div>
    </DashboardLayout>
  );
}
```

## 🎨 Customizando o Menu

### Usando itens padrão

```tsx
import { DashboardLayout } from '@/shared/components/Layout';
import { defaultMenuItems } from '@/shared/components/Sidebar/menuItems';

<DashboardLayout menuItems={defaultMenuItems} />;
```

### Criando itens customizados

```tsx
import { DashboardLayout } from '@/shared/components/Layout';
import type { MenuItem } from '@/shared/components/Sidebar';

const meuMenu: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <MeuIcone />,
    href: '/dashboard',
  },
  {
    id: 'vendas',
    label: 'Vendas',
    icon: <VendasIcon />,
    children: [
      {
        id: 'pedidos',
        label: 'Pedidos',
        href: '/pedidos',
      },
      {
        id: 'clientes',
        label: 'Clientes',
        href: '/clientes',
      },
    ],
  },
];

<DashboardLayout menuItems={meuMenu} />;
```

## 📝 Estrutura de MenuItem

```typescript
interface MenuItem {
  id: string; // ID único
  label: string; // Texto exibido
  icon?: React.ReactNode; // Ícone (opcional)
  href?: string; // Link (opcional)
  onClick?: () => void; // Função ao clicar (opcional)
  badge?: string | number; // Badge/contador (opcional)
  children?: MenuItem[]; // Subitens para dropdown
}
```

## 🎯 Funcionalidades

### ✅ Menu Lateral

- Responsivo (mobile/desktop)
- Fechamento automático no mobile após clicar em item
- Overlay escuro no mobile
- Animações suaves

### ✅ Dropdown

- Suporte a múltiplos níveis
- Animação de expansão/colapso
- Fechamento ao clicar fora
- Indentação visual para subitens

### ✅ Navegação

- Destaque do item ativo baseado na rota
- Links usando Next.js Link
- Suporte a onClick customizado

### ✅ Footer do Usuário

- Exibe informações do usuário
- Botão de logout integrado
- Avatar ou ícone padrão

## 📱 Responsividade

- **Mobile**: Menu lateral oculto por padrão, abre com botão hamburger
- **Desktop**: Menu lateral sempre visível
- **Tablet**: Comportamento adaptativo

## 🎨 Customização de Estilos

Os componentes usam Tailwind CSS. Você pode customizar:

- Cores: Modifique as classes `bg-blue-*`, `text-blue-*`
- Espaçamento: Ajuste `px-4`, `py-3`, etc.
- Tamanhos: Modifique `w-64` (largura do sidebar)

## 📦 Componentes Disponíveis

- `Sidebar` - Componente principal do menu lateral
- `MenuItem` - Item individual do menu
- `Dropdown` - Dropdown para subitens
- `DashboardLayout` - Layout wrapper completo

## 🔧 Exemplos

### Menu com badge

```tsx
{
  id: "notificacoes",
  label: "Notificações",
  badge: 5,
  href: "/notificacoes",
}
```

### Menu com onClick

```tsx
{
  id: "acao",
  label: "Ação Customizada",
  onClick: () => {
    console.log("Clicado!");
  },
}
```

### Menu com múltiplos níveis

```tsx
{
  id: "principal",
  label: "Principal",
  children: [
    {
      id: "sub1",
      label: "Subitem 1",
      children: [
        {
          id: "subsub1",
          label: "Sub-subitem 1",
          href: "/subsub1",
        },
      ],
    },
  ],
}
```
