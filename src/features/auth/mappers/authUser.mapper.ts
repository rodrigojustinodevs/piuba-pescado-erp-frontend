import {
  extractCompanyIdFromJWT,
  extractEmailFromJWT,
  extractNameFromJWT,
  extractRoleFromJWT,
  extractUserIdFromJWT,
} from '@/shared/utils/jwtExtractors';

export type UserCompany = { id: string; name: string; role: string };

export type NormalizedAuthUser = {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  companyId: string | null;
  /** Empresas ativas do usuário (vem de `/auth/me`); alimenta o seletor de empresa. */
  companies?: UserCompany[];
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
  companies?: unknown;
};

function pickCompanies(value: unknown): UserCompany[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.flatMap((item) => {
    const c = item as Record<string, unknown> | null;
    if (!c || c.id == null) return [];
    return [{ id: String(c.id), name: String(c.name ?? ''), role: String(c.role ?? '') }];
  });
}

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

  const companies = pickCompanies(apiData?.companies);
  return {
    ...(companies ? { companies } : {}),
    id: apiData?.id || apiData?.user?.id || extractUserIdFromJWT(decodedToken),
    email: apiData?.email || apiData?.user?.email || extractEmailFromJWT(decodedToken),
    name: apiData?.name || apiData?.user?.name || extractNameFromJWT(decodedToken),
    role: roleFromApi || roleFromToken,
    companyId: companyIdFromApi || companyIdFromToken || null,
  };
}
