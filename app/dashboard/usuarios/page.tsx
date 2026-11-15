'use client';

import { UsersListView } from '@/features/user/components/UsersListView';
import { useUsersListPage } from '@/features/user/hooks/useUsersListPage';
import { DashboardLayout } from '@/shared/components/Layout';

export default function UsersPage() {
  const state = useUsersListPage();

  return (
    <DashboardLayout>
      <UsersListView {...state} />
    </DashboardLayout>
  );
}
