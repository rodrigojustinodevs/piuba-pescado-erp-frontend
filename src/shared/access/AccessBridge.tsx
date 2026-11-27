'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isPublicRoute } from '@/shared/constants/publicRoutes';
import { useToast } from '@/shared/contexts/ToastContext';
import { accessEvents } from './accessEvents';
import { ACCESS_MESSAGES } from './messages';

/**
 * Liga o tratamento central de erros (fora do React) à interface: toast e navegação.
 * Montado uma vez, dentro dos providers de Query, Auth e Toast.
 */
export function AccessBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showError, showWarning } = useToast();
  const redirecting = useRef(false);
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
    if (!isPublicRoute(pathname)) redirecting.current = false;
  }, [pathname]);

  useEffect(
    () =>
      accessEvents.onNotice((notice) => {
        switch (notice.type) {
          case 'sessionEnded':
            // Sem loop: em rota pública (login, reset) ou já redirecionando, ignora.
            if (redirecting.current || isPublicRoute(pathRef.current)) return;
            redirecting.current = true;
            queryClient.clear();
            accessEvents.reset();
            router.replace('/login?reason=session_ended');
            return;
          case 'forbidden':
            showError(ACCESS_MESSAGES.FORBIDDEN);
            return;
          case 'readOnly':
            showWarning(notice.message);
            return;
          case 'conflict':
            showWarning(notice.message);
            return;
          case 'noCompany':
            accessEvents.openCompanySelector();
            return;
        }
      }),
    [queryClient, router, showError, showWarning],
  );

  return null;
}
