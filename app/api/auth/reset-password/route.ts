import { successResponse, failureResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { publicHttpClient } from '@/shared/lib/http/publicHttpClient';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { resetPasswordSchema } from '@/features/auth/schemas';

export const POST = withErrorHandling(async (req: Request) => {
  const parsed = resetPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return failureResponse(ErrorMessages.LOGIN_REQUIRED_FIELDS, 400);

  await publicHttpClient.request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(parsed.data),
  });

  return successResponse({ ok: true }, 200);
}, 'auth/reset-password');
