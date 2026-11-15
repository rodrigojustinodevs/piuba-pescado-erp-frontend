'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '../api';
import type { ResetPasswordPayload } from '../schemas';

export function useForgotPassword() {
  return useMutation({ mutationFn: (email: string) => authService.forgotPassword(email) });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authService.resetPassword(payload),
  });
}
