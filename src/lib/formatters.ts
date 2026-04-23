/**
 * Format a number with commas (Indian numbering system)
 */
export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  const n = Math.abs(Math.round(num));
  const str = n.toString();
  if (str.length <= 3) return str;
  const last3 = str.slice(-3);
  const remaining = str.slice(0, -3);
  const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${formatted},${last3}`;
}

/** Format a percentage value */
export function formatPercent(val: number): string {
  return `${val.toFixed(1)}%`;
}

/** Format resource units */
export function formatUnits(val: number): string {
  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
  return val.toString();
}
