'use client';

import { FeedingsListView, useFeedingsListPage } from '@/features/feeding';
import { DashboardLayout } from '@/shared/components/Layout';

export default function FeedingsPage() {
  const state = useFeedingsListPage();

  return (
    <DashboardLayout>
      <FeedingsListView {...state} />
    </DashboardLayout>
  );
}
