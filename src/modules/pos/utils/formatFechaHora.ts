/**
 * formatFechaHora
 *
 * Convierte una fecha ISO a formato legible (Chile)
 * Ejemplo:
 * 2026-01-16T04:30:04.683Z → 16/01/2026 01:30
 */
export function formatFechaHora(
  iso: string
): string {
  if (!iso) return ''

  const date = new Date(iso)

  return date.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}