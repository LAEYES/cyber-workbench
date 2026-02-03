export function splitList(v: string): string[] {
  const s = (v ?? "").trim();
  if (!s) return [];
  return s
    .split(/\s*[;,]\s*/g)
    .map((x) => x.trim())
    .filter(Boolean);
}
