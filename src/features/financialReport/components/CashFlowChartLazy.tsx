'use client';

import dynamic from 'next/dynamic';

export const CashFlowChart = dynamic(() => import('./CashFlowChart'), {
  ssr: false,
  loading: () => <div className="h-80 animate-pulse rounded-lg bg-slate-100" aria-hidden="true" />,
});
