import { useState, useCallback, useMemo } from 'react'

import { useCaja } from '../Caja/context/CajaProvider'
import { usePosProductos } from './usePosProductos'
import { usePosScanner } from './usePosScanner'
import { usePosVentaFlow } from './usePosVentaFlow'
import { usePosCobroFlow } from './usePosCobroFlow'

import type { DocumentoReceptor } from '../venta/domain/venta.types'

/* =======================================================
   POS CONTROLLER
======================================================= */

export function usePosController() {

  /* ===============================
     LOCAL UI
  =============================== */

  const [query, setQuery] = useState('')
  const [highlightedId, setHighlightedId] =
    useState<string | null>(null)

  /* ===============================
     SCANNER
  =============================== */

  const { scannerRef, focusScanner } =
    usePosScanner()

  /* ===============================
     FLOWS
  =============================== */

  const {
    venta,
    postVenta,

    showReceptor,
    openReceptor,
    closeReceptor,

    onConfirmVenta,
  } = usePosVentaFlow()

  const cobro = usePosCobroFlow({
    totalVenta: venta.total,
    onConfirmVenta,
  })

  const cobroStable = useMemo(() => cobro, [cobro])

  /* ===============================
     PRODUCTOS
  =============================== */

  const {
    productos,
    stockMap,
    loading: loadingProductos,
  } = usePosProductos(query)

  /* ===============================
     CAJA
  =============================== */

  const {
    cajaSeleccionada,
    aperturaActiva,
    cargando: cargandoCaja,
  } = useCaja()

  const bloqueado =
    cargandoCaja ||
    !cajaSeleccionada ||
    !aperturaActiva ||
    postVenta.open ||
    showReceptor ||
    cobroStable.showTipoPago ||
    cobroStable.showPayment

  /* ===============================
     HELPERS
  =============================== */

  const flashHighlight = useCallback(
    (id: string) => {
      setHighlightedId(id)
      setTimeout(() => {
        setHighlightedId(null)
      }, 200)
    },
    []
  )

  /* ===============================
     DOCUMENTO
  =============================== */

  const documentoTributario =
    venta.documentoTributario

  const setTipoDocumento =
    venta.setTipoDocumento

  const setReceptor = useCallback(
    (receptor: DocumentoReceptor) => {
      venta.setReceptor(receptor)
      closeReceptor()
      cobroStable.openCobro()
    },
    [venta, closeReceptor, cobroStable]
  )

  /* ===============================
     ADD PRODUCT
  =============================== */

  const onAddProduct = useCallback(
    (p: {
      _id: string
      nombre: string
      precio: number
      activo: boolean
    }) => {

      if (bloqueado || !p.activo) return

      venta.addProduct({
        productoId: p._id,
        nombre: p.nombre,
        precioUnitario: p.precio,
        stockDisponible: stockMap[p._id] ?? 0,
      })

      flashHighlight(p._id)
      focusScanner()

    },
    [
      bloqueado,
      venta,
      stockMap,
      focusScanner,
      flashHighlight,
    ]
  )

  /* ===============================
     CART ACTIONS
  =============================== */

  const clearCart = useCallback(() => {
    venta.clear()
  }, [venta])

  const increase = useCallback(
    (productoId: string) => {
      venta.increase(productoId)
      flashHighlight(productoId)
    },
    [venta, flashHighlight]
  )

  const decrease = useCallback(
    (productoId: string) => {
      venta.decrease(productoId)
      flashHighlight(productoId)
    },
    [venta, flashHighlight]
  )

  /* ===============================
     SHORTCUT TARGET
  =============================== */

  const resolveTargetId = useCallback(() => {

    if (highlightedId) return highlightedId

    const last = venta.cart.at(-1)
    if (!last) return null

    return last.productoId

  }, [highlightedId, venta.cart])

  const increaseLast = useCallback(() => {

    if (bloqueado) return

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.increase(targetId)
    flashHighlight(targetId)

  }, [bloqueado, resolveTargetId, venta, flashHighlight])

  const decreaseLast = useCallback(() => {

    if (bloqueado) return

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.decrease(targetId)
    flashHighlight(targetId)

  }, [bloqueado, resolveTargetId, venta, flashHighlight])

  /* ===============================
     COBRAR
  =============================== */

  const onCobrar = useCallback(() => {

    if (bloqueado) return

    if (
      documentoTributario.tipo === 'FACTURA' &&
      !documentoTributario.receptor
    ) {
      openReceptor()
      return
    }

    cobroStable.openCobro()

  }, [
    bloqueado,
    documentoTributario,
    openReceptor,
    cobroStable,
  ])

  /* ===============================
     RETURN
  =============================== */

  return {

    /* scanner */
    scannerRef,
    focusScanner,

    /* productos */
    productos,
    stockMap,
    loadingProductos,

    query,
    setQuery,

    /* cart */
    cart: venta.cart,
    total: venta.total,

    increase,
    decrease,
    increaseLast,
    decreaseLast,

    clearCart,

    highlightedId,

    /* documento */
    documentoTributario,
    setTipoDocumento,
    setReceptor,

    /* caja */
    cargandoCaja,
    bloqueado,

    /* flows */
    onAddProduct,
    onCobrar,

    cobro: cobroStable,
    postVenta,

    /* receptor */
    showReceptor,
    closeReceptor,
  }
}