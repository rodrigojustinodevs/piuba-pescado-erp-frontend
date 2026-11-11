/** Gera um JWT sem assinatura válida (suficiente: o app só decodifica o payload). */
export function fakeJwt(payload: Record<string, unknown>): string {
  const enc = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${enc({ alg: 'none', typ: 'JWT' })}.${enc(payload)}.sig`;
}

export const inSeconds = (seconds: number) => Math.floor(Date.now() / 1000) + seconds;
