import {
  memo,
  useCallback,
  useState,
  useEffect,
} from 'react'

import ModalBase from './ModalBase'

import { useResumenPrevioCajaQuery } from '@/domains/caja/hooks/useResumenPrevioCajaQuery'
import { useVentasApertura } from '@/domains/venta/hooks/useVentasApertura'

import { VentasAperturaList } from '@/modules/pos/checkout/postventa/VentasAperturaList'
import { VentaDetallePanel } from '@/modules/pos/checkout/postventa/VentaDetallePanel'

import { Button } from '@/shared/ui/button/button'
import { Separator } from '@/shared/ui/separator/separator'

import type { VentaApertura } from '@/domains/venta/domain/venta.types'

interface Props {
  cajaId: string
  onClose: () => void
}

function ResumenCajaModal({
  cajaId,
  onClose,
}: Props) {

  const {
    data,
    isLoading,
    refetch,
  } = useResumenPrevioCajaQuery(cajaId)

  const {
    ventas,
    loading: loadingVentas,
    anularVenta,
  } = useVentasApertura(cajaId)

  const [
    ventaSeleccionada,
    setVentaSeleccionada,
  ] = useState<VentaApertura | null>(null)

  useEffect(() => {
    if (!ventaSeleccionada) return

    const updated =
      ventas.find(
        v =>
          v.ventaId ===
          ventaSeleccionada.ventaId
      )

    if (updated) {
      setVentaSeleccionada(updated)
    }

  }, [ventas, ventaSeleccionada])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (!cajaId) return null

  return (
    <ModalBase
      title="📊 Resumen de Caja"
      onClose={onClose}
      maxWidth="xl"
    >

      {/* ================= Totales ================= */}

      {isLoading && (
        <div className="text-center py-4 text-muted-foreground">
          Cargando resumen…
        </div>
      )}

      {!isLoading && data && (
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">

          <div className="space-y-2">

            <Fila
              label="Monto inicial"
              value={data.montoInicial}
            />

            <Fila
              label="Total ventas"
              value={data.totalVentas}
            />

            <Fila
              label="Efectivo por ventas"
              value={data.efectivoVentas}
            />

            <Separator className="my-2" />

            <Fila
              label="Efectivo esperado"
              value={data.efectivoEsperado}
              bold
            />

          </div>

          <div>

            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Por medio de pago
            </div>

            <div className="space-y-2">

              <Fila
                label="Efectivo"
                value={data.pagosPorTipo.EFECTIVO}
              />

              <Fila
                label="Débito"
                value={data.pagosPorTipo.DEBITO}
              />

              <Fila
                label="Crédito"
                value={data.pagosPorTipo.CREDITO}
              />

              <Fila
                label="Transferencia"
                value={data.pagosPorTipo.TRANSFERENCIA}
              />

            </div>

          </div>

        </div>
      )}

      {/* ================= Ventas ================= */}

      <div className="grid grid-cols-2 gap-4 h-[420px]">

        <div className="border border-border rounded-lg overflow-hidden bg-surface">

          <VentasAperturaList
            ventas={ventas}
            loading={loadingVentas}
            ventaSeleccionadaId={
              ventaSeleccionada?.ventaId
            }
            onSelect={setVentaSeleccionada}
          />

        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-surface">

          <VentaDetallePanel
            venta={ventaSeleccionada}
            onAnular={anularVenta}
          />

        </div>

      </div>

      {/* ================= Footer ================= */}

      <div className="mt-6 flex justify-center gap-4">

        <Button
          variant="secondary"
          onClick={handleRefresh}
        >
          Actualizar
        </Button>

        <Button
          variant="primary"
          onClick={onClose}
        >
          Cerrar
        </Button>

      </div>

    </ModalBase>
  )
}

export default memo(ResumenCajaModal)

interface FilaProps {
  label: string
  value: number
  bold?: boolean
}

const Fila = memo(function Fila({
  label,
  value,
  bold,
}: FilaProps) {
  return (
    <div
      className={`flex justify-between items-center ${
        bold ? 'text-lg font-semibold' : ''
      }`}
    >
      <span className={bold ? '' : 'text-muted-foreground'}>
        {label}
      </span>

      <span>
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
})