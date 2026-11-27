import { cookies } from 'next/headers';
import { decodeJWT } from '@/shared/utils/jwt';
import { AUTH_COOKIE_NAME, authCookieOptions, resolveCookieMaxAge } from './authCookie';
import { refreshSessionToken } from './sessionRefresh';

/** Código devolvido pelo BFF quando a sessão não pode mais ser renovada. */
export const SESSION_ENDED_CODE = 'SESSION_ENDED';

export async function writeSessionCookie(token: string) {
  const store = await cookies();
  store.set({ ...authCookieOptions(resolveCookieMaxAge(decodeJWT(token))), value: token });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set({ ...authCookieOptions(0), value: '' });
}

/**
 * Renova o token do cookie atual e regrava o cookie. O `cookies()` do route handler
 * é mutável: as leituras seguintes no mesmo request já veem o token novo.
 * Se a API recusar (senha trocada, usuário inativo, janela vencida), limpa o cookie;
 * se estiver fora do ar, mantém o cookie e devolve `null`.
 */
export async function renewSession(): Promise<string | null> {
  const store = await cookies();
  const current = store.get(AUTH_COOKIE_NAME)?.value;
  if (!current) return null;

  const result = await refreshSessionToken(current);
  if (typeof result === 'object') {
    await writeSessionCookie(result.token);
    return result.token;
  }
  if (result === 'rejected') await clearSessionCookie();
  return null;
}
