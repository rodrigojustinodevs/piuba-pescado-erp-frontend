'use client';

import { useNotificationsQuery } from '../../hooks/queries';
import { NotificationsForm } from '../notifications/NotificationsForm';
import { TabStatus } from '../TabStatus';

export function NotificationsTab() {
  const query = useNotificationsQuery(true);
  if (!query.data) return <TabStatus query={query} />;
  return <NotificationsForm preferences={query.data} editable />;
}
