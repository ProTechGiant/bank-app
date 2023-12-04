export function convertEnumToArray(enumObj: Record<string, string>) {
  return Object.entries(enumObj).map(([label, value]) => ({ label, value }));
}
