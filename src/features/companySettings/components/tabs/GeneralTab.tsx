'use client';

import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { OrganizationForm } from '../general/OrganizationForm';
import { UnitsForm } from '../general/UnitsForm';
import { TabStatus } from '../TabStatus';

export function GeneralTab({ editable }: Readonly<{ editable: boolean }>) {
  const { settings, isLoading, error, reload, replace } = useCompanySettings();
  if (!settings) return <TabStatus query={{ isLoading, error, refetch: reload }} cards={2} />;

  return (
    <div className="flex flex-col gap-6">
      <OrganizationForm settings={settings} editable={editable} onSaved={replace} />
      <UnitsForm settings={settings} editable={editable} onSaved={replace} />
    </div>
  );
}
