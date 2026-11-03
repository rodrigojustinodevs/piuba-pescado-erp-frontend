## Piuba Pescado ERP — how to build with this library

**Setup.** Components are on `window.PiubaDS` (`const { Button, Card } = window.PiubaDS`). Link only `styles.css`; it carries the Tailwind utilities and the theme tokens. No root provider is needed for most components. Exceptions:
- `SidebarProvider` must wrap `Sidebar`. Use `<Sidebar collapsible="none">` for an inline (non-fixed) sidebar and give the provider `className="min-h-0 h-full"` inside a fixed-height box, or it grows to the viewport.
- `TooltipProvider` must wrap `Tooltip`. `AlertModalProvider` must wrap `AlertModal`.
- `AppHeader` and `AuthCompanyGate` read the app's auth context, which is not in this bundle. Do not use them; compose headers from `Avatar`, `Button` and `PageHeader`.
- `next/link`, `next/image` and `next/navigation` are replaced by static stand-ins: links are plain `<a>`, `usePathname()` returns `/dashboard`.

**Styling idiom: Tailwind utilities on semantic tokens.** Style your own layout with Tailwind classes, using the token colors rather than raw hex. Light theme is `:root`; add class `dark` on an ancestor for dark mode.

| Family | Classes |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-muted` `bg-secondary` `bg-sidebar` |
| Text | `text-foreground` `text-muted-foreground` `text-card-foreground` `text-primary-foreground` |
| Brand / status | `bg-primary` (teal) `text-primary` `bg-destructive` |
| Lines | `border` + `border-border` |
| Shape | `rounded-xl` (cards), `rounded-md`; radius token `--radius` |

CSS variables, usable as `var(--primary)`: `--background --foreground --card --muted-foreground --destructive --border --ring --sidebar --chart-1` (also `--chart-2..5`, `--sidebar-*`).

**Component API essentials.**
- `Button`: `variant` = `default | destructive | outline | secondary | ghost | link`; `size` = `default | sm | lg | icon`.
- `Badge`: `variant` = `default | secondary | destructive | outline`.
- `Card` is a set: `Card > CardHeader (CardTitle, CardDescription) + CardContent + CardFooter`.
- `Table` is a set: `Table > TableCaption, TableHeader > TableRow > TableHead, TableBody > TableRow > TableCell`.
- Page chrome: `PageHeader` (`breadcrumb`, `title`, `subtitle`, `icon`), `ListHeader`, `StatCard`, `MetricCard`, `BarChart`.
- Domain icons (`TankIcon`, `FeedingIcon`, `SensorIcon`, …) take `className` for size and color (`h-6 w-6 text-primary`).

**Where the truth lives.** Read `styles.css` (tokens + utilities) and each component's `<Name>.prompt.md` and `<Name>.d.ts` before styling. Many `.d.ts` are loose (`[key: string]: unknown`); the `.prompt.md` examples and the previews in `components/*/<Name>/<Name>.html` show the real props.

**Example.**
```jsx
const { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } = window.PiubaDS;

<Card style={{ width: 340 }}>
  <CardHeader>
    <CardTitle>Tanque 03</CardTitle>
    <Badge variant="secondary">Tilápia</Badge>
  </CardHeader>
  <CardContent className="text-sm text-muted-foreground">Oxigênio dissolvido: 6,2 mg/L</CardContent>
  <CardFooter className="gap-2">
    <Button>Ver detalhes</Button>
    <Button variant="outline">Registrar manejo</Button>
  </CardFooter>
</Card>
```
