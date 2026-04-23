/**
 * Format a number in Indian numbering system (₹ Lakhs/Crores format)
 * e.g., 514909.95 → "5,14,909.95"
 *       1000000  → "10,00,000"
 */
export function formatINR(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "0";
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

/**
 * Format a percentage value with 1 decimal place
 */
export function formatPercent(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "0%";
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0%";
  return `${n.toFixed(1)}%`;
}

/**
 * Format resource units with appropriate suffix
 */
export function formatUnits(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return "0";
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
