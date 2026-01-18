import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

/* ===============================
   Dominio POS
=============================== */
import { crearVentaPOS } from './pos.api'
import { useVenta } from './venta/useVenta'
import { useCobroPOS } from './Cobro/hooks/useCobroPOS'
import { useCaja } from './Caja/context/CajaProvider'

/* ===============================
   Auth + Productos
=============================== */
import { useAuth } from '../auth/useAuth'
import { usePosProductos } from './productos/usePosProductos'

/* ===============================
   Scanner (infra UI)
=============================== */
import { useScannerFocus } from './venta/hooks/useScannerFocus'

export function usePosController() {
  /* ===============================
     Auth
  =============================== */
  const { user } = useAuth()
  if (!user) {
    throw new Error(
      'usePosController debe usarse con usuario autenticado'
    )
  }

  const SUCURSAL_ID = user.sucursalId

  /* ===============================
     React Query
  =============================== */
  const queryClient = useQueryClient()

  /* ===============================
     Estado UI mínimo
  =============================== */
  const [query, setQuery] = useState('')

  /* ===============================
     Scanner
  =============================== */
  const { scannerRef, focusScanner } = useScannerFocus()

  /* ===============================
     Dominio Venta
  =============================== */
  const venta = useVenta()

  /* ===============================
     Caja
  =============================== */
  const {
    cajaSeleccionada,
    aperturaActiva,
    cargando: cargandoCaja,
  } = useCaja()

  /* ===============================
     Productos
  =============================== */
  const {
    productos,
    stockMap,
    loading: loadingProductos,
  } = usePosProductos(SUCURSAL_ID, query)

  /* ===============================
     Bloqueos UX
  =============================== */
  const bloqueado =
    cargandoCaja ||
    !cajaSeleccionada ||
    !aperturaActiva

  /* ===============================
     Agregar producto (ESTABLE)
  =============================== */
  const onAddProduct = useCallback(
    (p: {
      _id: string
      nombre: string
      precio: number
      activo: boolean
    }) => {
      if (bloqueado) return
      if (!p.activo) return

      venta.addProduct({
        productoId: p._id,
        nombre: p.nombre,
        precioUnitario: p.precio,
        stockDisponible: stockMap[p._id] ?? 0,
      })

      focusScanner()
    },
    [bloqueado, venta, stockMap, focusScanner]
  )

  /* ===============================
     Confirmar venta (ESTABLE)
  =============================== */
  const onConfirmVenta = useCallback(
    async ({
      pagos,
      ajusteRedondeo,
    }: {
      pagos: any[]
      ajusteRedondeo: number
    }) => {
      if (!cajaSeleccionada || !aperturaActiva)
        return

      await crearVentaPOS({
        cajaId: cajaSeleccionada.id,
        aperturaCajaId: aperturaActiva.id,
        pagos,
        ajusteRedondeo,
        items: venta.cart.map(item => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      })

      queryClient.invalidateQueries({
        queryKey: ['stock-sucursal', SUCURSAL_ID],
      })

      venta.clear()
      focusScanner()
    },
    [
      cajaSeleccionada,
      aperturaActiva,
      venta,
      queryClient,
      SUCURSAL_ID,
      focusScanner,
    ]
  )

  /* ===============================
     Cobro (REFERENCIA ESTABLE)
  =============================== */
  const cobro = useCobroPOS({
    totalVenta: venta.total,
    onConfirmVenta,
  })

  const cobroStable = useMemo(() => cobro, [cobro])

  /* ===============================
     API pública
  =============================== */
  return {
    /* Scanner */
    scannerRef,
    focusScanner,

    /* Productos */
    productos,
    stockMap,
    loadingProductos,
    query,
    setQuery,

    /* Venta */
    cart: venta.cart,
    total: venta.total,
    increase: venta.increase,
    decrease: venta.decrease,

    /* Caja */
    cargandoCaja,
    bloqueado,

    /* Acciones */
    onAddProduct,
    onCobrar: cobroStable.openCobro,

    /* Cobro */
    cobro: cobroStable,
  }
}