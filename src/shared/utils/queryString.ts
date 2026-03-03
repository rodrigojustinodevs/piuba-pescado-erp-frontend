export type QueryValue = string | number | boolean | null | undefined;

export function buildQueryString(
  params: Record<string, QueryValue>,
  options?: { skipEmptyString?: boolean },
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (options?.skipEmptyString && stringValue === '') continue;
    searchParams.set(key, stringValue);
  }

  return searchParams.toString();
}
