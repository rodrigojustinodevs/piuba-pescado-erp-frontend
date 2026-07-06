'use client';

import { UsersListView } from '@/features/user/components/UsersListView';
import { useUsersListPage } from '@/features/user/hooks/useUsersListPage';
import { DashboardLayout } from '@/shared/components/Layout';
import { demoUser } from '@/shared/constants/demoUser';

export default function UsersPage() {
  const state = useUsersListPage();

  return (
    <DashboardLayout user={demoUser}>
      <UsersListView {...state} />
    </DashboardLayout>
  );
}
