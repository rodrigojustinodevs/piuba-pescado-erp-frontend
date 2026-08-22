'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { extractHttpStatus } from '@/shared/lib/http/httpError';

export function useAuthRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isRedirectingRef = useRef(false);

  useEffect(() => {
    const maybeRedirect = (error: unknown) => {
      if (pathname?.startsWith('/login')) {
        return;
      }

      if (isRedirectingRef.current) {
        return;
      }

      if (extractHttpStatus(error) === 401) {
        isRedirectingRef.current = true;
        queryClient.clear();
        router.push('/login');
      }
    };

    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      maybeRedirect(event.query?.state.error);
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe((event) => {
      maybeRedirect(event.mutation?.state.error);
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [pathname, queryClient, router]);
}
