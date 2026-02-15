import { useState, useMemo, useCallback } from 'react'

import type { TipoPago, PagoPOS } from '../../domain/pos.types'
import type { EstadoCobro } from '../domain/cobro.types'
import type { ConfirmVentaPayload } from '../../domain/pos.contracts'

import { calcularEstadoCobro } from '../domain/cobro.logic'
import { buildPagos } from '../domain/pagos.factory'
import { normalizarNumero } from '../ui/utils/normalizarNumero'

/* =====================================================
   Props
===================================================== */

interface UseCobroPOSProps {
  totalVenta: number
  onConfirmVenta: (
    data: ConfirmVentaPayload
  ) => Promise<void>
}

/* =====================================================
   Hook
===================================================== */

export function useCobroPOS({
  totalVenta,
  onConfirmVenta,
}: UseCobroPOSProps) {

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
     Normalización
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
     Estado de cobro
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

  // 👉 NUEVO
  const backToTipoPago = useCallback(() => {
    setShowPayment(false)
    setShowTipoPago(true)
    setModoPago(null)
    setEfectivo('')
    setDebito('')
  }, [])

  const closeAll = useCallback(() => {
    setShowTipoPago(false)
    setShowPayment(false)
    setModoPago(null)
    setEfectivo('')
    setDebito('')
    setLoading(false)
  }, [])

  /* ===============================
     Confirmar
  =============================== */

  const confirm = useCallback(async () => {
    if (!estado) return
    if (!modoPago) return
    if (!estado.puedeConfirmar) return
    if (loading) return

    try {
      setLoading(true)

      const pagos: PagoPOS[] = buildPagos({
        totalCobrado: totalVenta,
        modo: modoPago,
        efectivo,
        debito,
      })

      await onConfirmVenta({ pagos })

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
    totalVenta,
    onConfirmVenta,
    closeAll,
  ])

  return {
    estado,
    loading,

    showTipoPago,
    showPayment,

    modoPago,
    selectTipoPago,

    setEfectivo,
    setDebito,

    openCobro,
    confirm,
    closeAll,

    backToTipoPago,
  }
}

export type CobroController =
  ReturnType<typeof useCobroPOS>