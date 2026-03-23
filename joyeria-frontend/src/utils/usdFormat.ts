/**
 * Admin / charts: fixed en-US so USD is consistent and Y-axis labels are not clipped
 * (browser locale + narrow YAxis width was truncating currency symbols).
 */
export function formatUsd(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

/** Compact ticks for Recharts YAxis — always starts with $, no trailing symbol clipping */
export function formatUsdAxisTick(value: number | string): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
