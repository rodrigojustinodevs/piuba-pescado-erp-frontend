import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token ?? null;
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  return !!token;
}
