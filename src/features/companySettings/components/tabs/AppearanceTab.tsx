'use client';

import { useCompanySettings } from '@/shared/contexts/CompanySettingsContext';
import { CompanyAppearanceForm } from '../appearance/CompanyAppearanceForm';
import { MyAppearanceForm } from '../appearance/MyAppearanceForm';
import { TabStatus } from '../TabStatus';

export function AppearanceTab({ editable }: Readonly<{ editable: boolean }>) {
  const { settings, isLoading, error, reload, replace } = useCompanySettings();
  if (!settings) return <TabStatus query={{ isLoading, error, refetch: reload }} cards={2} />;

  return (
    <div className="flex flex-col gap-6">
      <MyAppearanceForm settings={settings} editable={editable} onSaved={replace} />
      <CompanyAppearanceForm settings={settings} editable={editable} onSaved={replace} />
    </div>
  );
}
