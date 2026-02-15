import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeJWT } from '@/shared/utils/jwt';
import {
  extractRoleFromJWT,
  extractUserIdFromJWT,
  extractEmailFromJWT,
  extractNameFromJWT,
  extractCompanyIdFromJWT,
} from '@/shared/utils/jwtExtractors';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8005';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const apiResponse = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await apiResponse.json();

    if (data.status === true && data.response?.token) {
      const token = data.response.token;
      const res = NextResponse.json({
        ok: true,
        message: data.message || 'Login successful',
        token,
      });

      res.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    return NextResponse.json(
      { ok: false, message: data.message || 'Invalid credentials' },
      { status: 401 },
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  const decodedToken = decodeJWT(token);

  try {
    const apiResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (apiResponse.ok) {
      const userData = await apiResponse.json();
      const roleFromToken = decodedToken ? extractRoleFromJWT(decodedToken) : null;
      const roleFromApi =
        userData.role || userData.user?.role || userData.userType || userData.user?.userType;
      const finalRole = roleFromApi || roleFromToken;

      // Extrai companyId de várias fontes possíveis
      const companyIdFromApi =
        userData.companyId ||
        userData.user?.companyId ||
        userData.company_id ||
        userData.user?.company_id;
      const companyIdFromToken = decodedToken ? extractCompanyIdFromJWT(decodedToken) : null;
      const finalCompanyId = companyIdFromApi || companyIdFromToken || null;

      const user = {
        id:
          userData.id ||
          userData.user?.id ||
          (decodedToken ? extractUserIdFromJWT(decodedToken) : null),
        email:
          userData.email ||
          userData.user?.email ||
          (decodedToken ? extractEmailFromJWT(decodedToken) : null),
        name:
          userData.name ||
          userData.user?.name ||
          (decodedToken ? extractNameFromJWT(decodedToken) : null),
        role: finalRole,
        companyId: finalCompanyId,
      };

      console.log('[AUTH] 🔍 Debug completo de autenticação:', {
        userFinal: user,
        userDataRaw: userData,
        decodedToken: decodedToken,
        companyIdFromApi: companyIdFromApi,
        companyIdFromToken: companyIdFromToken,
        finalCompanyId: finalCompanyId,
        roleFromApi: roleFromApi,
        roleFromToken: roleFromToken,
        finalRole: finalRole,
      });

      return NextResponse.json({ isAuthenticated: true, user }, { status: 200 });
    }

    if (decodedToken) {
      const user = {
        id: extractUserIdFromJWT(decodedToken),
        email: extractEmailFromJWT(decodedToken),
        name: extractNameFromJWT(decodedToken),
        role: extractRoleFromJWT(decodedToken),
        companyId: extractCompanyIdFromJWT(decodedToken) || null,
      };

      return NextResponse.json({ isAuthenticated: true, user }, { status: 200 });
    }

    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  } catch (error) {
    console.error('[AUTH] Error:', error);

    if (decodedToken) {
      const user = {
        id: extractUserIdFromJWT(decodedToken),
        email: extractEmailFromJWT(decodedToken),
        name: extractNameFromJWT(decodedToken),
        role: extractRoleFromJWT(decodedToken),
        companyId: extractCompanyIdFromJWT(decodedToken) || null,
      };

      return NextResponse.json({ isAuthenticated: true, user }, { status: 200 });
    }

    return NextResponse.json({ isAuthenticated: true }, { status: 200 });
  }
}
