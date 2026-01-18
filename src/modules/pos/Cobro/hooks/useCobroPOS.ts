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
 * Hook orquestador del flujo de cobro POS.
 *
 * - Maneja estado UI (inputs y modales)
 * - Normaliza valores numéricos
 * - Consume dominio puro de cobro
 * - Construye el payload final
 *
 * No renderiza UI ni conoce backend.
 */
export function useCobroPOS({
  totalVenta,
  onConfirmVenta,
}: UseCobroPOSProps) {
  /* ===============================
     Estado UI
  =============================== */
  const [showTipoPago, setShowTipoPago] =
    useState(false)
  const [showPayment, setShowPayment] =
    useState(false)

  const [modoPago, setModoPago] =
    useState<TipoPago | null>(null)

  // Inputs como strings (UX)
  const [efectivoRaw, setEfectivo] =
    useState('')
  const [debitoRaw, setDebito] =
    useState('')

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
     Estado de dominio
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
    estado,

    showTipoPago,
    showPayment,
    loading,

    modoPago,
    selectTipoPago,

    setEfectivo,
    setDebito,

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