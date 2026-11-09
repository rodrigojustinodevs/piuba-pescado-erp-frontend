'use client';

import { useDataOverviewQuery } from '../../hooks/queries';
import { AuditLogCard } from '../audit/AuditLogCard';
import { ComingSoonCard } from '../data/ComingSoonCard';
import { DataExportCard } from '../data/DataExportCard';
import { DataOverviewCard } from '../data/DataOverviewCard';
import { RecentExportsCard } from '../data/RecentExportsCard';
import { TabStatus } from '../TabStatus';

export function DataTab() {
  const query = useDataOverviewQuery(true);

  return (
    <div className="flex flex-col gap-6">
      {query.data ? (
        <>
          <DataOverviewCard overview={query.data} />
          <DataExportCard />
          <RecentExportsCard exports={query.data.recentExports} />
          <ComingSoonCard capabilities={query.data.capabilities} />
        </>
      ) : (
        <TabStatus query={query} cards={2} />
      )}
      {/* Permissão própria (view-audit-log): carrega e trata 403 separadamente. */}
      <AuditLogCard />
    </div>
  );
}
