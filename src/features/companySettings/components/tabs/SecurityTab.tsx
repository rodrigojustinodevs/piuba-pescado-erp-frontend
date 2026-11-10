'use client';

import { useSecurityQuery } from '../../hooks/queries';
import { SecurityForm } from '../security/SecurityForm';
import { TabStatus } from '../TabStatus';

export function SecurityTab() {
  const query = useSecurityQuery(true);
  if (!query.data) return <TabStatus query={query} cards={2} />;
  return <SecurityForm security={query.data} editable />;
}
