export function isValidDate(iso: string | null | undefined): iso is string {
  return !!iso && !Number.isNaN(new Date(iso).getTime());
}

/** `true` quando `updatedAt` difere de `createdAt` em 1 s ou mais. */
export function wasUpdatedAfterCreation(
  createdAt: string | null | undefined,
  updatedAt: string | null | undefined,
): boolean {
  if (!isValidDate(createdAt) || !isValidDate(updatedAt)) return false;
  return Math.abs(new Date(updatedAt).getTime() - new Date(createdAt).getTime()) >= 1000;
}
