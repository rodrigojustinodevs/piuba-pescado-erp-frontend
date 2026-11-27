import { withAuthGuard } from '@/features/auth/guards/withAuthGuard';
import { failureResponse, successResponse } from '@/shared/lib/api/responseEnvelope';
import { withErrorHandling } from '@/shared/lib/api/routeMiddleware';
import { serverHttpClient } from '@/shared/lib/http';
import { writeSessionCookie } from '@/shared/lib/http/serverSession';

type SwitchCompanyApiResponse = {
  response?: { token?: string; company_id?: string; role?: string };
};

/**
 * POST /api/auth/switch-company — troca a empresa ativa. A API invalida o token e
 * emite outro com o novo `cid`; o token novo só vai para o cookie httpOnly.
 */
const handler = withErrorHandling(async (req: Request) => {
  const body = (await req.json().catch(() => ({}))) as { companyId?: unknown };
  if (typeof body.companyId !== 'string' || !body.companyId) {
    return failureResponse('Escolha uma empresa.', 422, { companyId: ['Escolha uma empresa.'] });
  }

  const data = await serverHttpClient.request<SwitchCompanyApiResponse>(
    '/api/auth/switch-company',
    { method: 'POST', body: JSON.stringify({ companyId: body.companyId }) },
  );
  const token = data.response?.token;
  if (!token) return failureResponse('Não foi possível trocar de empresa.', 502);

  await writeSessionCookie(token);
  return successResponse(
    { companyId: data.response?.company_id ?? body.companyId, role: data.response?.role ?? null },
    200,
  );
}, 'Auth Switch Company API Proxy');

export const POST = withAuthGuard(async (_auth, req: Request) => handler(req));
