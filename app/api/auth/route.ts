import { cookies } from 'next/headers';
import { normalizeAuthUser, type AuthApiDataLike } from '@/features/auth/mappers/authUser.mapper';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { failureResponse, successResponse } from '@/shared/lib/api/responseEnvelope';
import { HttpClient, serverHttpClient } from '@/shared/lib/http';
import { getApiBaseUrl } from '@/shared/lib/http/apiUrl';
import { authCookieOptions, resolveCookieMaxAge } from '@/shared/lib/http/authCookie';
import { HttpError } from '@/shared/lib/http/httpError';
import { decodeJWT } from '@/shared/utils/jwt';

const publicHttpClient = new HttpClient({ baseUrl: getApiBaseUrl() });

function isExpired(payload: Record<string, unknown> | null): boolean {
  const exp = Number(payload?.exp);
  return Number.isFinite(exp) && exp * 1000 <= Date.now();
}

type LoginApiResponse = {
  status: boolean;
  response?: {
    token?: string;
  };
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return failureResponse(ErrorMessages.LOGIN_REQUIRED_FIELDS, 400);
    }
    const data = await publicHttpClient.request<LoginApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = data.response?.token;
    if (!token) return failureResponse(ErrorMessages.LOGIN_CREDENTIALS, 401);

    const cookieStore = await cookies();
    cookieStore.set({
      ...authCookieOptions(resolveCookieMaxAge(decodeJWT(token))),
      value: token,
    });

    // O token nunca é devolvido ao browser: fica apenas no cookie httpOnly.
    return successResponse({ ok: true, message: data.message || 'Login successful' }, 200);
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      return failureResponse(ErrorMessages.LOGIN_CREDENTIALS, 401);
    }
    return failureResponse(ErrorMessages.LOGIN_SERVER_ERROR, 500);
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return successResponse({ isAuthenticated: false }, 200);
  }

  const decodedToken = decodeJWT(token);
  if (!decodedToken || isExpired(decodedToken)) {
    cookieStore.set({ ...authCookieOptions(0), value: '' });
    return successResponse({ isAuthenticated: false }, 200);
  }

  try {
    const data = await serverHttpClient.request<AuthApiDataLike>('/api/auth/me', {
      method: 'GET',
    });
    return successResponse({ isAuthenticated: true, user: normalizeAuthUser(data, decodedToken) }, 200);
  } catch (error) {
    // Backend rejeitou o token (revogado/inválido): a sessão não é mais válida.
    if (error instanceof HttpError && (error.status === 401 || error.status === 403)) {
      cookieStore.set({ ...authCookieOptions(0), value: '' });
      return successResponse({ isAuthenticated: false }, 200);
    }
    // Indisponibilidade transitória do backend: usa o JWT (já validado quanto à expiração).
    return successResponse(
      { isAuthenticated: true, user: normalizeAuthUser({}, decodedToken) },
      200,
    );
  }
}
