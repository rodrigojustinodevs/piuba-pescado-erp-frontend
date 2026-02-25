import { cookies } from 'next/headers';
import { successResponse } from '@/shared/lib/api/responseEnvelope';

/**
 * Endpoint para logout
 * Remove o cookie de autenticação
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  });

  return successResponse({ ok: true }, 200);
}
