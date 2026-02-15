import { memo, useCallback, useState } from 'react'
import ModalBase from './ModalBase'

import { useResumenPrevioCajaQuery } from '@/domains/caja/hooks/useResumenPrevioCajaQuery'
import { useVentasApertura } from '@/domains/venta/hooks/useVentasApertura'

import { VentasAperturaList } from '@/modules/pos/checkout/postventa/VentasAperturaList'
import { VentaDetallePanel } from '@/modules/pos/checkout/postventa/VentaDetallePanel'

import type { VentaApertura } from '@/domains/venta/domain/venta.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  cajaId: string
  onClose: () => void
}

/* =====================================================
   Componente
===================================================== */

function ResumenCajaModal({
  cajaId,
  onClose,
}: Props) {

  /* ================================
     Resumen de caja (React Query)
  ================================ */

  const {
    data,
    isLoading,
    refetch,
  } = useResumenPrevioCajaQuery(cajaId)

  /* ================================
     Ventas del turno
  ================================ */

  const {
    ventas,
    loading: loadingVentas,
    anularVenta,
  } = useVentasApertura(cajaId)

  /* ================================
     Venta seleccionada
  ================================ */

  const [
    ventaSeleccionada,
    setVentaSeleccionada,
  ] = useState<VentaApertura | null>(null)

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (!cajaId) return null

  /* ================================
     Render
  ================================ */

  return (
    <ModalBase
      title="📊 Resumen de Caja"
      onClose={onClose}
      maxWidth="xl"
    >

      {/* ================= Totales ================= */}

      {isLoading && (
        <div className="text-center py-4 text-slate-400">
          Cargando resumen…
        </div>
      )}

      {!isLoading && data && (
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">

          {/* Totales principales */}
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

            <div className="border-t border-slate-700 my-2" />

            <Fila
              label="Efectivo esperado"
              value={data.efectivoEsperado}
              bold
            />

          </div>

          {/* Medios de pago */}
          <div>

            <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
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

        {/* Lista */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">

          <VentasAperturaList
            ventas={ventas}
            loading={loadingVentas}
            ventaSeleccionadaId={
              ventaSeleccionada?.ventaId
            }
            onSelect={setVentaSeleccionada}
          />

        </div>

        {/* Detalle */}
        <div className="border border-slate-700 rounded-lg overflow-hidden">

          <VentaDetallePanel
            venta={ventaSeleccionada}
            onAnular={anularVenta}
          />

        </div>

      </div>

      {/* ================= Footer ================= */}

      <div className="mt-6 flex justify-center gap-4">

        <button
          onClick={handleRefresh}
          className="
            px-5 py-2 text-sm rounded-lg
            bg-slate-800 hover:bg-slate-700
            border border-slate-700
          "
        >
          Actualizar
        </button>

        <button
          onClick={onClose}
          className="
            px-5 py-2 text-sm rounded-lg font-medium
            bg-emerald-600 hover:bg-emerald-500
          "
        >
          Cerrar
        </button>

      </div>

    </ModalBase>
  )
}

export default memo(ResumenCajaModal)

/* =====================================================
   Subcomponente
===================================================== */

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
        bold ? 'text-lg font-bold' : ''
      }`}
    >
      <span>{label}</span>
      <span>
        ${value.toLocaleString('es-CL')}
      </span>
    </div>
  )
})