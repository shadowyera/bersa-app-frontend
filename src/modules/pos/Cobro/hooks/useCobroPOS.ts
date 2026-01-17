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
  /** Total original de la venta (sin redondeo) */
  totalVenta: number

  /** Persistencia de la venta (PosPage) */
  onConfirmVenta: (
    data: ConfirmacionCobro
  ) => Promise<void>
}

/**
 * useCobroPOS
 *
 * Hook orquestador del flujo de cobro POS
 *
 * RESPONSABILIDADES:
 * - Mantener estado UI (strings)
 * - Normalizar valores numéricos
 * - Usar dominio puro
 * - Construir pagos
 *
 * NO:
 * - Renderiza UI
 * - Contiene JSX
 */
export function useCobroPOS({
  totalVenta,
  onConfirmVenta,
}: UseCobroPOSProps) {
  /* ===============================
     Estado UI
     (STRINGS – inputs reales)
  =============================== */
  const [showTipoPago, setShowTipoPago] =
    useState(false)
  const [showPayment, setShowPayment] =
    useState(false)

  const [modoPago, setModoPago] =
    useState<TipoPago | null>(null)

  const [efectivoRaw, setEfectivo] =
    useState('')
  const [debitoRaw, setDebito] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  /* ===============================
     Normalización numérica
     (único punto de conversión)
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
     Estado de dominio
     (fuente única de verdad)
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
  const openCobro = useCallback(() => {
    if (totalVenta <= 0) return
    setShowTipoPago(true)
  }, [totalVenta])

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
    onConfirmVenta,
    closeAll,
  ])

  /* ===============================
     API pública
  =============================== */
  return {
    /* estado dominio */
    estado,

    /* flags UI */
    showTipoPago,
    showPayment,
    loading,

    /* modo */
    modoPago,
    selectTipoPago,

    /* montos (STRINGS) */
    setEfectivo,
    setDebito,

    /* flujo */
    openCobro,
    confirm,
    closeAll,
  }
}

/* ===============================
   Tipo exportado para UI
=============================== */
export type CobroController =
  ReturnType<typeof useCobroPOS>