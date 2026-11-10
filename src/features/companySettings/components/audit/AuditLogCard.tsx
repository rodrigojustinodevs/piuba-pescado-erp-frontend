'use client';

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { auditFieldLabel, auditValueLabel } from '../../constants/auditLabels';
import { SECTION_LABELS } from '../../constants/options';
import { useAuditLogsQuery } from '../../hooks/queries';
import type { SettingChange, SettingsSection } from '../../types';
import { Field, SelectField } from '../fields';
import { SettingsCard } from '../SettingsCard';
import { SettingsSkeleton, TabStatus } from '../TabStatus';

const PER_PAGE = 20;
const ALL = 'all';

const SECTION_OPTIONS = [
  { value: ALL, label: 'Todas as seções' },
  ...Object.entries(SECTION_LABELS).map(([value, label]) => ({ value, label })),
];

function AuditItem({ item }: Readonly<{ item: SettingChange }>) {
  const { formatDateTime } = useCompanySettings();
  const entries = Object.entries(item.changes);

  return (
    <li className="py-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
          {SECTION_LABELS[item.section] ?? item.section}
        </span>
        <span className="font-medium text-foreground">{item.user?.name ?? 'Usuário removido'}</span>
        <time dateTime={item.createdAt} className="text-xs text-muted-foreground tabular-nums">
          {formatDateTime(item.createdAt)}
        </time>
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {entries.map(([key, change]) => (
          <li
            key={key}
            className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground"
          >
            <span className="font-medium text-foreground">{auditFieldLabel(key)}:</span>
            <span className="break-all">{auditValueLabel(change.old)}</span>
            <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="sr-only">para</span>
            <span className="break-all text-foreground">{auditValueLabel(change.new)}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function AuditLogCard() {
  const [section, setSection] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const query = useAuditLogsQuery(
    { page, perPage: PER_PAGE, section: section === ALL ? null : (section as SettingsSection) },
    true,
  );
  const data = query.data;

  let content;
  if (!data) {
    content = query.isLoading ? <SettingsSkeleton /> : <TabStatus query={query} />;
  } else if (data.items.length === 0) {
    content = <p className="py-6 text-sm text-muted-foreground">Nenhuma alteração registrada.</p>;
  } else {
    content = (
      <ul className="divide-y divide-border" aria-busy={query.isFetching}>
        {data.items.map((item) => (
          <AuditItem key={item.id} item={item} />
        ))}
      </ul>
    );
  }

  return (
    <SettingsCard
      title="Histórico de alterações"
      description="Quem alterou o quê, e quando. Datas no fuso da empresa."
      aside={
        <Field label="Filtrar por seção" className="w-full sm:w-56 [&>label]:sr-only">
          <SelectField
            value={section}
            onValueChange={(value) => {
              setSection(value);
              setPage(1);
            }}
            options={SECTION_OPTIONS}
          />
        </Field>
      }
    >
      {content}
      {data && data.lastPage > 1 ? (
        <nav
          aria-label="Paginação do histórico"
          className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4"
        >
          <p className="text-xs text-muted-foreground tabular-nums">
            Página {data.page} de {data.lastPage} · {data.total} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={data.page <= 1 || query.isFetching}
            >
              <ChevronLeft aria-hidden="true" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={data.page >= data.lastPage || query.isFetching}
            >
              Próxima
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </nav>
      ) : null}
    </SettingsCard>
  );
}
