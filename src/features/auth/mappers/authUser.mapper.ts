import {
  extractCompanyIdFromJWT,
  extractEmailFromJWT,
  extractNameFromJWT,
  extractRoleFromJWT,
  extractUserIdFromJWT,
} from '@/shared/utils/jwtExtractors';

export type NormalizedAuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  companyId: string | null;
};

type AuthApiUserLike = {
  id?: string | null;
  email?: string | null;
  name?: string | null;
  role?: string | null;
  userType?: string | null;
  companyId?: string | null;
};

export type AuthApiDataLike = AuthApiUserLike & {
  user?: AuthApiUserLike | null;
};

type JwtPayload = Record<string, unknown>;

export function normalizeAuthUser(
  apiData: AuthApiDataLike | null | undefined,
  decodedToken: JwtPayload | null,
): NormalizedAuthUser {
  const roleFromApi =
    apiData?.role || apiData?.user?.role || apiData?.userType || apiData?.user?.userType || null;
  const roleFromToken = extractRoleFromJWT(decodedToken);

  const companyIdFromApi = apiData?.companyId || apiData?.user?.companyId || null;
  const companyIdFromToken = extractCompanyIdFromJWT(decodedToken);

  return {
    id: apiData?.id || apiData?.user?.id || extractUserIdFromJWT(decodedToken),
    email: apiData?.email || apiData?.user?.email || extractEmailFromJWT(decodedToken),
    name: apiData?.name || apiData?.user?.name || extractNameFromJWT(decodedToken),
    role: roleFromApi || roleFromToken,
    companyId: companyIdFromApi || companyIdFromToken || null,
  };
}
