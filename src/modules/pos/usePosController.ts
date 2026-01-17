import { useCallback, useState } from 'react'
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

/**
 * usePosController
 *
 * Hook de orquestación del POS.
 *
 * Responsabilidades:
 * - Conectar caja + venta + productos + cobro
 * - Exponer handlers listos para la UI
 * - Calcular estados derivados (bloqueos)
 *
 * NO renderiza UI
 * NO contiene JSX
 */
export function usePosController() {
  /* ===============================
     Auth
  =============================== */
  const { user } = useAuth()
  if (!user) {
    throw new Error('usePosController debe usarse con usuario autenticado')
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
     Agregar producto
  =============================== */
  const handleAddProduct = useCallback(
    (p: {
      _id: string
      nombre: string
      precio: number
      activo: boolean
    }) => {
      if (!p.activo) return

      venta.addProduct({
        productoId: p._id,
        nombre: p.nombre,
        precioUnitario: p.precio,
        stockDisponible: stockMap[p._id] ?? 0,
      })

      focusScanner()
    },
    [venta, stockMap, focusScanner]
  )

  /* ===============================
     Cobro
  =============================== */
  const cobro = useCobroPOS({
    totalVenta: venta.total,

    onConfirmVenta: async ({
      pagos,
      ajusteRedondeo,
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

      // Refrescar stock de sucursal
      queryClient.invalidateQueries({
        queryKey: ['stock-sucursal', SUCURSAL_ID],
      })

      venta.clear()
      focusScanner()
    },
  })

  /* ===============================
     Bloqueos UX
  =============================== */
  const bloqueado =
    cargandoCaja ||
    !cajaSeleccionada ||
    !aperturaActiva

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
    onAddProduct: bloqueado
      ? () => {}
      : handleAddProduct,
    onCobrar: cobro.openCobro,

    /* Cobro */
    cobro,
  }
}