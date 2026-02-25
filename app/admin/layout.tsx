'use client';

import { withPageAuth } from '@/features/auth/guards/withPageAuth';

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPageAuth(AdminLayout);
