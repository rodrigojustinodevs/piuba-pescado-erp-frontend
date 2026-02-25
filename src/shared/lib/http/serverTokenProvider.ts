import { cookies } from 'next/headers';
import { TokenProvider } from './httpAuth';

export class ServerTokenProvider implements TokenProvider {
  async getToken(): Promise<string | null> {
    const store = await cookies();
    return store.get('auth_token')?.value ?? null;
  }
}
