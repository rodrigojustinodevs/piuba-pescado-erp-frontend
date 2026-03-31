'use client';

import type { ReactNode } from 'react';
import type { AuthenticatedUser } from '@/shared/types/auth';

type AuthCompanyGateProps = {
  user: AuthenticatedUser | null | undefined;
  showCompanySelect: boolean;
  children: ReactNode;
};

export function AuthCompanyGate({ user, showCompanySelect, children }: Readonly<AuthCompanyGateProps>) {
  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-700">
        Carregando sessão...
      </div>
    );
  }

  if (!showCompanySelect && !user.companyId) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-900">
        Não foi possível identificar a empresa do usuário. Faça login novamente ou contate o suporte.
      </div>
    );
  }

  return <>{children}</>;
}

