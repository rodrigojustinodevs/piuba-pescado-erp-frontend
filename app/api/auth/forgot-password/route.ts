import { successResponse, failureResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { publicHttpClient } from '@/shared/lib/http/publicHttpClient';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { forgotPasswordSchema } from '@/features/auth/schemas';

export const POST = withErrorHandling(async (req: Request) => {
  const parsed = forgotPasswordSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return failureResponse(ErrorMessages.LOGIN_REQUIRED_FIELDS, 400);

  await publicHttpClient.request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: parsed.data.email }),
  });

  // Resposta sempre genérica: não revela se o e-mail existe.
  return successResponse({ ok: true }, 200);
}, 'auth/forgot-password');
