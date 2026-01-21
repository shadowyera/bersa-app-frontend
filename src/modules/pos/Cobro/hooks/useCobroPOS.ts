import { useState, useMemo, useCallback } from 'react'

import type { TipoPago } from '../../pos.types'
import type {
  EstadoCobro,
  ConfirmacionCobro,
} from '../domain/cobro.types'

import { calcularEstadoCobro } from '../domain/cobro.logic'
import { buildPagos } from '../domain/pagos.factory'
import { normalizarNumero } from '../ui/utils/normalizarNumero'

interface UseCobroPOSProps {
  totalVenta: number
  onConfirmVenta: (
    data: ConfirmacionCobro
  ) => Promise<void>
}

/**
 * =====================================================
 * useCobroPOS
 *
 * Hook orquestador del flujo de cobro POS.
 *
 * Responsabilidades:
 * - Orquestar el flujo UI del cobro
 * - Normalizar inputs numéricos
 * - Consumir dominio puro (cálculo / pagos)
 * - Construir el payload final
 *
 * ❌ No renderiza UI
 * ❌ No conoce backend
 * =====================================================
 */
export function useCobroPOS({
  totalVenta,
  onConfirmVenta,
}: UseCobroPOSProps) {
  /* ===============================
     Estado UI (modales)
  =============================== */
  const [showTipoPago, setShowTipoPago] =
    useState(false)
  const [showPayment, setShowPayment] =
    useState(false)

  /* ===============================
     Modo de pago seleccionado
  =============================== */
  const [modoPago, setModoPago] =
    useState<TipoPago | null>(null)

  /* ===============================
     Inputs (strings por UX)
  =============================== */
  const [efectivoRaw, setEfectivo] =
    useState('')
  const [debitoRaw, setDebito] =
    useState('')

  /* ===============================
     Estado de confirmación
  =============================== */
  const [loading, setLoading] =
    useState(false)

  /* ===============================
     Normalización numérica
  =============================== */
  const efectivo = useMemo(
    () => normalizarNumero(efectivoRaw),
    [efectivoRaw]
  )

  const debito = useMemo(
    () => normalizarNumero(debitoRaw),
    [debitoRaw]
  )

  /* ===============================
     Estado de dominio (cobro)
  =============================== */
  const estado: EstadoCobro | null =
    useMemo(() => {
      if (!modoPago) return null

      return calcularEstadoCobro({
        totalVenta,
        modo: modoPago,
        efectivo,
        debito,
      })
    }, [totalVenta, modoPago, efectivo, debito])

  /* ===============================
     Flujo UI
  =============================== */

  /**
   * Abre el flujo de cobro
   * (guardia de venta vacía)
   */
  const openCobro = useCallback(() => {
    if (totalVenta <= 0) return
    setShowTipoPago(true)
  }, [totalVenta])

  /**
   * Selección de tipo de pago
   * Reinicia inputs y avanza flujo
   */
  const selectTipoPago = useCallback(
    (tipo: TipoPago) => {
      setModoPago(tipo)
      setEfectivo('')
      setDebito('')
      setShowTipoPago(false)
      setShowPayment(true)
    },
    []
  )

  /**
   * Cierre total del flujo de cobro
   * (cancelación o post-confirmación)
   */
  const closeAll = useCallback(() => {
    setShowTipoPago(false)
    setShowPayment(false)
    setModoPago(null)
    setEfectivo('')
    setDebito('')
    setLoading(false)
  }, [])

  /* ===============================
     Confirmar cobro
  =============================== */
  const confirm = useCallback(async () => {
    if (!estado || !modoPago) return
    if (!estado.puedeConfirmar) return
    if (loading) return

    try {
      setLoading(true)

      const pagos = buildPagos({
        totalCobrado: estado.totalCobrado,
        modo: modoPago,
        efectivo,
        debito,
      })

      const payload: ConfirmacionCobro = {
        pagos,
        ajusteRedondeo:
          estado.ajusteRedondeo,
        totalCobrado:
          estado.totalCobrado,
        modo: modoPago,
      }

      await onConfirmVenta(payload)

      closeAll()
    } finally {
      setLoading(false)
    }
  }, [
    estado,
    modoPago,
    efectivo,
    debito,
    loading,
    onConfirmVenta,
    closeAll,
  ])

  /* ===============================
     API pública
  =============================== */
  return {
    /* Estado */
    estado,
    loading,

    /* UI */
    showTipoPago,
    showPayment,

    /* Selección */
    modoPago,
    selectTipoPago,

    /* Inputs */
    setEfectivo,
    setDebito,

    /* Acciones */
    openCobro,
    confirm,
    closeAll,
  }
}

/**
 * Tipo del controller de cobro expuesto a la UI.
 */
export type CobroController =
  ReturnType<typeof useCobroPOS>