import { cookies } from 'next/headers';
import { successResponse } from '@/shared/lib/api/responseEnvelope';
import { serverHttpClient } from '@/shared/lib/http';
import { authCookieOptions } from '@/shared/lib/http/authCookie';

/**
 * Endpoint para logout.
 * Tenta invalidar o token no backend (best-effort) e sempre remove o cookie.
 */
export async function POST() {
  try {
    await serverHttpClient.request('/api/auth/logout', { method: 'POST', expectJson: false });
  } catch {
    // Backend indisponível ou token já inválido: o cookie é removido de qualquer forma.
  }

  const cookieStore = await cookies();
  cookieStore.set({ ...authCookieOptions(0), value: '' });

  return successResponse({ ok: true }, 200);
}
