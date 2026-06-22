type JWTPayload = Record<string, unknown>;

export function extractRoleFromJWT(payload: JWTPayload | null): string | null {
  if (!payload) return null;

  if (Array.isArray(payload.roles) && payload.roles.length > 0) {
    const role = payload.roles[0] as string;
    if (role === 'master_admin' || role === 'master') {
      return 'master';
    }
    if (role.endsWith('_admin')) {
      return role.replace('_admin', '');
    }
    return role;
  }

  if (payload.is_master_admin === true) {
    return 'master';
  }

  return (
    (payload.role as string) ||
    (payload.userType as string) ||
    (payload.user_type as string) ||
    null
  );
}

export function extractUserIdFromJWT(payload: JWTPayload | null): string | null {
  if (!payload) return null;

  return (
    (payload.id as string) ||
    (payload.user_id as string) ||
    (payload.sub as string) ||
    (payload.userId as string) ||
    null
  );
}

export function extractEmailFromJWT(payload: JWTPayload | null): string | null {
  if (!payload) return null;
  return (payload.email as string) || null;
}

export function extractNameFromJWT(payload: JWTPayload | null): string | null {
  if (!payload) return null;
  return (
    (payload.name as string) ||
    (payload.user_name as string) ||
    (payload.unm as string) ||
    null
  );
}

export function extractCompanyIdFromJWT(payload: JWTPayload | null): string | null {
  if (!payload) return null;
  return (
    (payload.companyId as string) ||
    (payload.company_id as string) ||
    (payload.cid as string) ||
    (payload.company as string) ||
    null
  );
}
