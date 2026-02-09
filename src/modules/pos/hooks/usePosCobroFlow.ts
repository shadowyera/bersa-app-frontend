import { useCobroPOS } from '../Cobro/hooks/useCobroPOS'
import type { ConfirmVentaPayload } from '../domain/pos.contracts'

export function usePosCobroFlow({
  totalVenta,
  onConfirmVenta,
}: {
  totalVenta: number
  onConfirmVenta: (
    data: ConfirmVentaPayload
  ) => Promise<void>
}) {

  const cobro = useCobroPOS({
    totalVenta,
    onConfirmVenta,
  })

  return cobro
}