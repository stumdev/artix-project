// lib/money.ts
export function normalizeDecimalInput(raw: string): string {
  if (raw == null) return '';
  let s = String(raw).replace(/,/g, '.');     // vírgula -> ponto
  s = s.replace(/[^0-9.]/g, '');              // remove não numéricos (mantém ponto)
  const parts = s.split('.');
  if (parts.length > 2) s = parts[0] + '.' + parts.slice(1).join(''); // apenas um ponto
  return s;
}

export function format2Decimals(raw: string): string {
  const n = parseFloat(normalizeDecimalInput(raw));
  if (isNaN(n)) return '';
  return n.toFixed(2);
}

export function toCents(raw: string): number {
  const n = parseFloat(normalizeDecimalInput(raw));
  if (isNaN(n)) return 0;
  return Math.round(n * 100);
}
