import { useState, useCallback } from 'react'
import { crearIngresoStock } from '../abastecimiento.api'
import {
  TIPO_ABASTECIMIENTO,
  type AbastecimientoItem,
  type AbastecimientoIngreso,
} from '../domain/abastecimiento.types'
import { useAuth } from '@/modules/auth/useAuth'

/**
 * useAbastecimiento
 *
 * Hook de dominio para ingreso de stock.
 *
 * REGLAS IMPORTANTES:
 * - NO existe proveedorId global
 * - El proveedor es SNAPSHOT por item
 * - El hook solo arma el evento
 * - El backend persiste el evento completo
 */
export const useAbastecimiento = () => {
  const { user } = useAuth()

  // La sucursal destino viene desde el usuario autenticado
  const sucursalId = user?.sucursal.id

  /* ================================
     Estado
  ================================ */

  const [items, setItems] = useState<
    AbastecimientoItem[]
  >([])

  const [observacion, setObservacion] =
    useState('')

  const [loading, setLoading] = useState(false)

  /* ================================
     Agregar producto
     - Crea snapshot del producto
     - Incluye proveedor si existe
  ================================ */
  const addProducto = useCallback((producto: any) => {
    setItems(prev => {
      const existente = prev.find(
        i => i.productoId === producto._id
      )

      if (existente) {
        return prev.map(i =>
          i.productoId === producto._id
            ? {
                ...i,
                cantidad: i.cantidad + 1,
              }
            : i
        )
      }

      return [
        ...prev,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          unidadBase: producto.unidadBase,
          cantidad: 1,

          // snapshot proveedor
          proveedorId:
            producto.proveedorId?._id ??
            undefined,
          proveedorNombre:
            producto.proveedorId?.nombre ??
            undefined,
        },
      ]
    })
  }, [])

  /* ================================
     Cambiar cantidad
  ================================ */
  const setCantidad = useCallback(
    (productoId: string, cantidad: number) => {
      setItems(prev =>
        prev.map(i =>
          i.productoId === productoId
            ? { ...i, cantidad }
            : i
        )
      )
    },
    []
  )

  /* ================================
     Quitar producto
  ================================ */
  const removeProducto = useCallback(
    (productoId: string) => {
      setItems(prev =>
        prev.filter(
          i => i.productoId !== productoId
        )
      )
    },
    []
  )

  /* ================================
     Confirmar ingreso
  ================================ */
  const confirmarIngreso = async () => {
    if (!items.length) return

    if (!sucursalId) {
      throw new Error(
        'No hay sucursal activa'
      )
    }

    const ingreso: AbastecimientoIngreso =
      {
        tipo: TIPO_ABASTECIMIENTO.INGRESO,
        sucursalDestinoId: sucursalId,
        observacion,
        items, // 👈 snapshot completo
      }

    setLoading(true)

    try {
      await crearIngresoStock(ingreso)

      // reset post-confirmación
      setItems([])
      setObservacion('')
    } finally {
      setLoading(false)
    }
  }

  return {
    /* estado */
    items,
    observacion,
    loading,

    /* acciones */
    addProducto,
    setCantidad,
    removeProducto,
    setObservacion,
    confirmarIngreso,
  }
}