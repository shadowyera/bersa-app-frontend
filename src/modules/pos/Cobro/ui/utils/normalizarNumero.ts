export function normalizarNumero(
  raw: string
): number {
  return Number(raw.replace(/\D/g, '') || 0)
}