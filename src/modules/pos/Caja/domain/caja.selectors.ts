import type { Caja, AperturaCaja, CajaVisual } from './caja.types'

/**
 * Construye el estado visual de las cajas.
 *
 * Reglas:
 * - La lista de cajas viene de /cajas
 * - El estado (abierta / quién abrió) viene de /aperturas/activas
 * - Nunca se devuelve una caja sin id
 *
 * ⚠️ Selector PURO:
 * - No muta
 * - No depende de React
 * - No hace fetch
 */
export function buildCajasVisuales(
  cajas: Caja[],
  aperturas: AperturaCaja[]
): CajaVisual[] {
  return cajas
    .filter(caja => Boolean(caja.id))
    .map(caja => {
      const apertura = aperturas.find(
        a => a.cajaId === caja.id
      )

      return {
        id: caja.id,
        nombre: caja.nombre,
        abierta: Boolean(apertura),
        abiertaPor: apertura?.usuarioAperturaNombre,
      }
    })
}