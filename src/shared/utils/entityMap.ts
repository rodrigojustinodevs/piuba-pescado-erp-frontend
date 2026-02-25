export function buildEntityMap<T extends { id: string }>(
  items: T[] | undefined,
  getLabel: (item: T) => string,
): Record<string, string> {
  const map: Record<string, string> = {};
  items?.forEach((item) => {
    map[item.id] = getLabel(item);
  });
  return map;
}
