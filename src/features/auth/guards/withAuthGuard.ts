import { cookies } from 'next/headers';
import { failureResponse } from '@/shared/lib/api/responseEnvelope';
import { decodeJWT } from '@/shared/utils/jwt';
import { extractCompanyIdFromJWT, extractRoleFromJWT } from '@/shared/utils/jwtExtractors';

type JwtPayload = Record<string, unknown>;

type WithAuthGuardOptions = {
  roles?: string[];
  requireCompany?: boolean;
};

export type AuthGuardContext = {
  token: string;
  decodedToken: JwtPayload;
  role: string | null;
  companyId: string | null;
};

function getTokenExpirationMs(decodedToken: JwtPayload): number | null {
  const exp = decodedToken.exp;

  if (typeof exp === 'number' && Number.isFinite(exp)) {
    return exp * 1000;
  }

  if (typeof exp === 'string') {
    const parsed = Number(exp);
    if (Number.isFinite(parsed)) {
      return parsed * 1000;
    }
  }

  return null;
}

export function withAuthGuard<TArgs extends unknown[]>(
  handler: (auth: AuthGuardContext, ...args: TArgs) => Promise<Response> | Response,
  options: WithAuthGuardOptions = {},
) {
  return async (...args: TArgs): Promise<Response> => {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return failureResponse('Unauthorized', 401);
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return failureResponse('Invalid token', 401);
    }

    const expirationMs = getTokenExpirationMs(decodedToken);
    if (expirationMs !== null && expirationMs <= Date.now()) {
      return failureResponse('Token expired', 401);
    }

    const role = extractRoleFromJWT(decodedToken);
    const companyId = extractCompanyIdFromJWT(decodedToken);

    if (options.roles?.length && (!role || !options.roles.includes(role))) {
      return failureResponse('Unauthorized', 401);
    }

    if (options.requireCompany && !companyId) {
      return failureResponse('Unauthorized', 401);
    }

    return handler(
      {
        token,
        decodedToken,
        role,
        companyId,
      },
      ...args,
    );
  };
}
