import { useCallback, useMemo, useState } from 'react'
import type { CartItem } from '../../../modules/pos/domain/pos.types'
import type {
  ProductoVendible,
  DocumentoTributario,
  DocumentoReceptor,
} from '../domain/venta.types'

import {
  agregarProducto,
  aumentarCantidad,
  disminuirCantidad,
  calcularTotal,
} from '@/domains/venta/domain/cart/cart.logic'

/**
 * Hook de estado de venta
 *
 * - NO contiene reglas de negocio
 * - Solo coordina estado + lógica pura
 * - API estable para evitar renders innecesarios
 */
export const useVenta = () => {
  /* =========================
     STATE
  ========================= */

  const [cart, setCart] = useState<CartItem[]>([])

  const [documentoTributario, setDocumentoTributario] =
    useState<DocumentoTributario>({
      tipo: 'BOLETA',
      requiereEmisionSii: false,
    })

  /* =========================
     ACTIONS (ESTABLES)
  ========================= */

  const addProduct = useCallback(
    (producto: ProductoVendible) => {
      setCart(prev =>
        agregarProducto(prev, producto)
      )
    },
    []
  )

  const increase = useCallback(
    (productoId: string) => {
      setCart(prev =>
        aumentarCantidad(prev, productoId)
      )
    },
    []
  )

  const decrease = useCallback(
    (productoId: string) => {
      setCart(prev =>
        disminuirCantidad(prev, productoId)
      )
    },
    []
  )

  const clear = useCallback(() => {
    setCart([])
    setDocumentoTributario({
      tipo: 'BOLETA',
      requiereEmisionSii: false,
    })
  }, [])

  /* =========================
     DOCUMENTO ACTIONS
  ========================= */

  const setTipoDocumento = useCallback(
    (tipo: 'BOLETA' | 'FACTURA') => {
      setDocumentoTributario(prev => {
        if (tipo === 'BOLETA') {
          return {
            tipo: 'BOLETA',
            requiereEmisionSii: false,
          }
        }

        return {
          tipo: 'FACTURA',
          receptor: prev.receptor,
          requiereEmisionSii: true,
        }
      })
    },
    []
  )

  const setReceptor = useCallback(
    (receptor: DocumentoReceptor) => {
      setDocumentoTributario({
        tipo: 'FACTURA',
        receptor,
        requiereEmisionSii: true,
      })
    },
    []
  )

  /* =========================
     DERIVED STATE
  ========================= */

  const hayStockInsuficiente = useMemo(
    () => cart.some(i => i.stockInsuficiente),
    [cart]
  )

  const total = useMemo(
    () => calcularTotal(cart),
    [cart]
  )

  /* =========================
     PUBLIC API
  ========================= */

  return {
    cart,
    total,

    documentoTributario,

    addProduct,
    increase,
    decrease,

    setTipoDocumento,
    setReceptor,

    hayStockInsuficiente,
    clear,
  }
}