'use client';

import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

function extractStatus(error: unknown): number | null {
  if (axios.isAxiosError(error)) {
    return error.response?.status ?? null;
  }

  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === 'number' ? status : null;
  }

  return null;
}

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

      if (extractStatus(error) === 401) {
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
