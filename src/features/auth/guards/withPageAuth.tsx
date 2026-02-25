'use client';

import { ComponentType, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpinnerIcon } from '@/shared/components/icons/AppIcons';

type AuthCheckResponse = {
  isAuthenticated: boolean;
};

type Envelope<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

function readAuthPayload(
  payload: Envelope<AuthCheckResponse> | AuthCheckResponse,
): AuthCheckResponse {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    payload.success === true
  ) {
    return payload.data;
  }

  return payload as AuthCheckResponse;
}

export function withPageAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  function ProtectedComponent(props: P) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      let isMounted = true;

      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth', { method: 'GET', cache: 'no-store' });
          const rawPayload = (await response.json()) as
            | Envelope<AuthCheckResponse>
            | AuthCheckResponse;
          const payload = readAuthPayload(rawPayload);

          if (!payload.isAuthenticated) {
            router.push('/login');
            return;
          }

          if (isMounted) {
            setIsAuthorized(true);
          }
        } catch {
          router.push('/login');
        }
      };

      void checkAuth();

      return () => {
        isMounted = false;
      };
    }, [router]);

    if (!isAuthorized) {
      return (
        <div className="flex min-h-screen items-center justify-center gap-2 text-slate-500">
          <SpinnerIcon className="h-5 w-5 animate-spin" />
          <span>Carregando...</span>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  }

  ProtectedComponent.displayName = `withPageAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ProtectedComponent;
}
