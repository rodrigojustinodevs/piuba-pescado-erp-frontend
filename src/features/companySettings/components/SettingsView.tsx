'use client';

import {
  Bell,
  Building2,
  Database,
  Loader2,
  Palette,
  Save,
  Settings,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/Tabs';
import { useAuthContext } from '@/shared/contexts/AuthContext';
import { SaveRegistryProvider, useSaveRegistryState } from '../hooks/saveRegistry';
import { getSettingsAccess, isMasterAdmin } from '../utils/permissions';
import { AppearanceTab } from './tabs/AppearanceTab';
import { DataTab } from './tabs/DataTab';
import { GeneralTab } from './tabs/GeneralTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { SecurityTab } from './tabs/SecurityTab';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

type TabId = 'geral' | 'notificacoes' | 'seguranca' | 'aparencia' | 'dados';

/** `all`: todos os membros · `managers`: quem pode gerenciar · `master`: só master_admin. */
type TabVisibility = 'all' | 'managers' | 'master';

type TabDef = { id: TabId; label: string; icon: LucideIcon; visibility: TabVisibility };

const TABS: TabDef[] = [
  { id: 'geral', label: 'Geral', icon: Building2, visibility: 'all' },
  { id: 'notificacoes', label: 'Notificações', icon: Bell, visibility: 'managers' },
  { id: 'seguranca', label: 'Segurança', icon: Shield, visibility: 'master' },
  { id: 'aparencia', label: 'Aparência', icon: Palette, visibility: 'master' },
  { id: 'dados', label: 'Dados', icon: Database, visibility: 'master' },
];

function SaveAllButton() {
  const { dirtyCount, isSaving, submitDirty } = useSaveRegistryState();
  return (
    <Button
      onClick={() => void submitDirty()}
      disabled={dirtyCount === 0 || isSaving}
      className="h-10 px-4"
    >
      {isSaving ? (
        <Loader2 className="animate-spin" aria-hidden="true" />
      ) : (
        <Save aria-hidden="true" />
      )}
      {isSaving ? 'Salvando…' : 'Salvar alterações'}
    </Button>
  );
}

/** Pede confirmação ao fechar/recarregar a página com alterações pendentes. */
function useBeforeUnload(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: BeforeUnloadEvent) => event.preventDefault();
    globalThis.addEventListener('beforeunload', handler);
    return () => globalThis.removeEventListener('beforeunload', handler);
  }, [active]);
}

function SettingsScreen() {
  const { user } = useAuthContext();
  const access = getSettingsAccess(user?.role);
  const editable = access !== 'none';
  const isMaster = isMasterAdmin(user?.role);
  const tabs = TABS.filter(
    (tab) =>
      tab.visibility === 'all' ||
      (tab.visibility === 'managers' && editable) ||
      (tab.visibility === 'master' && isMaster),
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get('aba') as TabId | null;
  const active = tabs.some((tab) => tab.id === requested) ? (requested as TabId) : 'geral';

  const { dirtyCount } = useSaveRegistryState();
  const [pendingTab, setPendingTab] = useState<TabId | null>(null);
  useBeforeUnload(dirtyCount > 0);

  function goTo(tab: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('aba', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleTabChange(next: string) {
    if (dirtyCount > 0) {
      setPendingTab(next as TabId);
      return;
    }
    goTo(next as TabId);
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-foreground text-balance">Configurações</h1>
            <p className="text-sm text-muted-foreground">
              Preferências do sistema, notificações e segurança
            </p>
          </div>
        </div>
        <SaveAllButton />
      </header>

      <Tabs value={active} onValueChange={handleTabChange} className="flex flex-col gap-6">
        <TabsList
          className="grid h-auto w-full rounded-xl p-1"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="h-9 gap-2 rounded-lg">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="geral" className="mt-0">
          <GeneralTab editable={editable} />
        </TabsContent>
        {editable ? (
          <TabsContent value="notificacoes" className="mt-0">
            <NotificationsTab />
          </TabsContent>
        ) : null}
        {isMaster ? (
          <>
            <TabsContent value="seguranca" className="mt-0">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="aparencia" className="mt-0">
              <AppearanceTab editable />
            </TabsContent>
            <TabsContent value="dados" className="mt-0">
              <DataTab />
            </TabsContent>
          </>
        ) : null}
      </Tabs>

      <UnsavedChangesDialog
        open={pendingTab !== null}
        onStay={() => setPendingTab(null)}
        onDiscard={() => {
          const target = pendingTab;
          setPendingTab(null);
          if (target) goTo(target);
        }}
      />
    </div>
  );
}

export function SettingsView() {
  return (
    <SaveRegistryProvider>
      <SettingsScreen />
    </SaveRegistryProvider>
  );
}
