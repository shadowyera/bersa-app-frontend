import { useState, useCallback, useMemo } from 'react'

import { useCaja } from '../Caja/context/CajaProvider'
import { usePosProductos } from './usePosProductos'
import { usePosScanner } from './usePosScanner'
import { usePosVentaFlow } from './usePosVentaFlow'
import { usePosCobroFlow } from './usePosCobroFlow'

/* =======================================================
   POS CONTROLLER
======================================================= */

export function usePosController() {

  /* ===============================
     STATE LOCAL
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

  const { venta, postVenta, onConfirmVenta } =
    usePosVentaFlow()

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
    postVenta.open

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
    [bloqueado, venta, stockMap, focusScanner, flashHighlight]
  )

  /* ===============================
     CLEAR
  =============================== */

  const clearCart = useCallback(() => {
    venta.clear()
  }, [venta])

  /* ===============================
     INCREASE / DECREASE DIRECTO
  =============================== */

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

  /* ===============================
     SHORTCUT ACTIONS
  =============================== */

  const increaseLast = useCallback(() => {

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.increase(targetId)
    flashHighlight(targetId)

  }, [resolveTargetId, venta, flashHighlight])

  const decreaseLast = useCallback(() => {

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.decrease(targetId)
    flashHighlight(targetId)

  }, [resolveTargetId, venta, flashHighlight])

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

    /* caja */
    cargandoCaja,
    bloqueado,

    /* flows */
    onAddProduct,
    onCobrar: cobroStable.openCobro,

    cobro: cobroStable,
    postVenta,
  }
}