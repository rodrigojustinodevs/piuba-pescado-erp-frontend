import { cookies } from 'next/headers';
import { ErrorMessages } from '@/shared/constants/errorMessages';
import { failureResponse } from '@/shared/lib/api/responseEnvelope';
import { renewSession, SESSION_ENDED_CODE } from '@/shared/lib/http/serverSession';
import { shouldRefresh } from '@/shared/lib/http/sessionRefresh';
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

function sessionEnded(): Response {
  return failureResponse(ErrorMessages.SESSION_ENDED, 401, undefined, {
    code: SESSION_ENDED_CODE,
  });
}

export function withAuthGuard<TArgs extends unknown[]>(
  handler: (auth: AuthGuardContext, ...args: TArgs) => Promise<Response> | Response,
  options: WithAuthGuardOptions = {},
) {
  return async (...args: TArgs): Promise<Response> => {
    const cookieStore = await cookies();
    let token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return sessionEnded();
    }

    let decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return failureResponse(ErrorMessages.INVALID_TOKEN, 401, undefined, {
        code: SESSION_ENDED_CODE,
      });
    }

    // Token vencido (ou quase): renova antes de chamar a API, com fila compartilhada.
    if (shouldRefresh(decodedToken)) {
      const renewed = await renewSession();
      const renewedPayload = renewed ? decodeJWT(renewed) : null;
      if (!renewed || !renewedPayload) return sessionEnded();
      token = renewed;
      decodedToken = renewedPayload;
    }

    const role = extractRoleFromJWT(decodedToken);
    const companyId = extractCompanyIdFromJWT(decodedToken);

    if (options.roles?.length && (!role || !options.roles.includes(role))) {
      return failureResponse(ErrorMessages.FORBIDDEN, 403);
    }

    if (options.requireCompany && !companyId) {
      return failureResponse(ErrorMessages.FORBIDDEN, 403);
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
