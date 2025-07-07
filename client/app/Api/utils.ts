export function formatNumber(value: number | string | null | undefined): string {
  const num = Number(value);
  if (isNaN(num)) return "—";
  return num.toLocaleString("en-US");
}


export function safeName(value: string | undefined | null): string {
  if (!value || typeof value !== "string") return "Unnamed";
  return value.trim();
}
