import { useState, useMemo, useCallback } from 'react'

import type { TipoPago, Pago } from '@/domains/venta/domain/pago/pago.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import type { ConfirmVentaPayload } from '@/domains/venta/domain/venta.contracts'

import { calcularEstadoCobro } from '@/domains/venta/domain/cobro/cobro.logic'
import { buildPagos } from '@/domains/venta/domain/pago/pago.factory'
import { normalizarNumero } from '../ui/utils/normalizarNumero'

/* =====================================================
   Props
===================================================== */

interface UsePagoPOSProps {
  totalVenta: number
  onConfirmVenta: (data: ConfirmVentaPayload) => Promise<void>
}

/* =====================================================
   Hook
===================================================== */

export function usePagoPOS({
  totalVenta,
  onConfirmVenta,
}: UsePagoPOSProps) {

  const [showTipoPago, setShowTipoPago] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const [modoPago, setModoPago] =
    useState<TipoPago | null>(null)

  const [efectivoRaw, setEfectivoRaw] = useState('')
  const [debitoRaw, setDebitoRaw] = useState('')

  const [loading, setLoading] = useState(false)

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
     Estado dominio
  =============================== */

  const estado: EstadoCobro | null = useMemo(() => {
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

  const openPago = useCallback(() => {
    if (totalVenta <= 0) return
    setShowTipoPago(true)
  }, [totalVenta])

  const selectTipoPago = useCallback(
    (tipo: TipoPago) => {

      setModoPago(tipo)

      if (tipo === 'MIXTO') {
        setEfectivoRaw('')
        setDebitoRaw(String(totalVenta))
      } else {
        setEfectivoRaw('')
        setDebitoRaw('')
      }

      setShowTipoPago(false)
      setShowPayment(true)
    },
    [totalVenta]
  )

  const backToTipoPago = useCallback(() => {
    setShowPayment(false)
    setShowTipoPago(true)
    setModoPago(null)
    setEfectivoRaw('')
    setDebitoRaw('')
  }, [])

  const closeAll = useCallback(() => {
    setShowTipoPago(false)
    setShowPayment(false)
    setModoPago(null)
    setEfectivoRaw('')
    setDebitoRaw('')
    setLoading(false)
  }, [])

  /* ===============================
     Input controlado (INTELIGENTE)
  =============================== */

  const setEfectivo = useCallback(
    (raw: string) => {

      const limpio = raw.replace(/\D/g, '')
      setEfectivoRaw(limpio)

      if (modoPago === 'MIXTO') {
        const efectivoNum = Number(limpio || 0)
        const restante =
          Math.max(totalVenta - efectivoNum, 0)

        setDebitoRaw(String(restante))
      }
    },
    [modoPago, totalVenta]
  )

  const setDebito = useCallback(
    (raw: string) => {

      const limpio = raw.replace(/\D/g, '')
      setDebitoRaw(limpio)

      if (modoPago === 'MIXTO') {
        const debitoNum = Number(limpio || 0)
        const restante =
          Math.max(totalVenta - debitoNum, 0)

        setEfectivoRaw(String(restante))
      }
    },
    [modoPago, totalVenta]
  )

  /* ===============================
     Teclado
  =============================== */

  const addMontoRapido = useCallback(
    (monto: number) => {

      setEfectivoRaw(prev => {
        const actual = normalizarNumero(prev)
        const nuevo = actual + monto

        if (modoPago === 'MIXTO') {
          const restante =
            Math.max(totalVenta - nuevo, 0)
          setDebitoRaw(String(restante))
        }

        return String(nuevo)
      })
    },
    [modoPago, totalVenta]
  )

  const deleteLastDigit = useCallback(() => {

    setEfectivoRaw(prev => {
      const nuevo = prev.slice(0, -1)

      if (modoPago === 'MIXTO') {
        const efectivoNum =
          normalizarNumero(nuevo)

        const restante =
          Math.max(totalVenta - efectivoNum, 0)

        setDebitoRaw(String(restante))
      }

      return nuevo
    })
  }, [modoPago, totalVenta])

  /* ===============================
     Confirmar
  =============================== */

  const confirm = useCallback(async () => {

    if (!estado || !modoPago) return
    if (!estado.puedeConfirmar) return
    if (loading) return

    try {
      setLoading(true)

      const pagos: Pago[] = buildPagos({
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

  /* ===============================
     API pública
  =============================== */

  return {
    estado,
    loading,

    showTipoPago,
    showPayment,

    modoPago,
    selectTipoPago,

    efectivoRaw,
    debitoRaw,

    setEfectivo,
    setDebito,

    addMontoRapido,
    deleteLastDigit,

    openPago,
    confirm,
    closeAll,
    backToTipoPago,
  }
}

/* =====================================================
   Type helper
===================================================== */

export type PagoController =
  ReturnType<typeof usePagoPOS>