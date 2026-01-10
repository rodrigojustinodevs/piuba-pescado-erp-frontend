type JWTPayload = Record<string, unknown>;

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    
    let decoded: string;
    if (typeof window === 'undefined') {
      decoded = Buffer.from(padded, 'base64').toString('utf-8');
    } else {
      decoded = atob(padded);
    }
    
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    return null;
  }
}

