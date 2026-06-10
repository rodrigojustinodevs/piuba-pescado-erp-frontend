import { cookies } from 'next/headers';
import { normalizeAuthUser, type AuthApiDataLike } from '@/features/auth/mappers/authUser.mapper';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { failureResponse, successResponse } from '@/shared/lib/api/responseEnvelope';
import { HttpClient, serverHttpClient } from '@/shared/lib/http';
import { HttpError } from '@/shared/lib/http/httpError';
import { decodeJWT } from '@/shared/utils/jwt';
const publicHttpClient = new HttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005',
});

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
    console.log('publicHttpClient', publicHttpClient);
    const data = await publicHttpClient.request<LoginApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const token = data.response?.token;
    if (!token) return failureResponse(ErrorMessages.LOGIN_CREDENTIALS, 401);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return successResponse(
      {
        ok: true,
        message: data.message || 'Login successful',
        token,
      },
      200,
    );
  } catch (error) {
    console.log(error);
    if (error instanceof HttpError && error.status === 401) {
      return failureResponse(ErrorMessages.LOGIN_CREDENTIALS, 401);
    }
    return failureResponse(ErrorMessages.LOGIN_SERVER_ERROR, 500);
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return successResponse({ isAuthenticated: false }, 200);
    }

    const decodedToken = decodeJWT(token);
    try {
      const data = await serverHttpClient.request<AuthApiDataLike>('/api/auth/me', {
        method: 'GET',
      });
      const user = normalizeAuthUser(data, decodedToken);
      return successResponse({ isAuthenticated: true, user }, 200);
    } catch {
      const user = normalizeAuthUser({}, decodedToken);
      return successResponse({ isAuthenticated: true, user }, 200);
    }
  } catch {
    return successResponse({ isAuthenticated: false }, 200);
  }
}
