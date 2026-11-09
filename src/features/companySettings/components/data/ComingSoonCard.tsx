import { Archive, History } from 'lucide-react';
import type { DataOverview } from '../../types';
import { SettingsCard } from '../SettingsCard';

const ITEMS = [
  {
    key: 'backupRequest',
    icon: Archive,
    title: 'Backup sob demanda',
    text: 'Solicitar uma cópia completa dos dados.',
  },
  {
    key: 'retentionPolicy',
    icon: History,
    title: 'Política de retenção',
    text: 'Definir por quanto tempo os dados ficam guardados.',
  },
] as const;

/** Funções que a API ainda não oferece: mostradas como "Em breve", nunca simuladas. */
export function ComingSoonCard({
  capabilities,
}: Readonly<{ capabilities: DataOverview['capabilities'] }>) {
  const pending = ITEMS.filter((item) => !capabilities[item.key]);
  if (pending.length === 0) return null;

  return (
    <SettingsCard title="Backup e retenção">
      <ul className="grid gap-3 sm:grid-cols-2">
        {pending.map(({ key, icon: Icon, title, text }) => (
          <li
            key={key}
            className="flex items-start gap-3 rounded-xl border border-dashed border-border px-4 py-3 opacity-70"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                {title}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Em breve
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </SettingsCard>
  );
}
