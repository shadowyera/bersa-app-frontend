import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuth } from '../../auth/useAuth'
import type { Producto } from '@/shared/types/producto.types'

import {
  setProductoActivo,
} from '@/shared/api/producto.api'

import { useProductosAdmin } from '@/shared/queries/useProductos'

import ProductosTable from './ProductosTable'
import ProductoModal from './ProductoModal'
import ConfirmDeactivateModal from '../ConfirmDeactivateModal'

export default function ProductosPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  /* =====================================================
     PERMISOS
  ===================================================== */

  const canEdit =
    user?.rol === 'ADMIN' || user?.rol === 'ENCARGADO'

  /* =====================================================
     DATA (React Query)
     Fuente única de verdad
  ===================================================== */

  const {
    data: productos = [],
    isLoading: loadingProductos,
  } = useProductosAdmin()

  /* =====================================================
     UI STATE (solo UI, no datos)
  ===================================================== */

  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toToggle, setToToggle] = useState<Producto | null>(null)

  /* =====================================================
     MUTATION: activar / desactivar producto
  ===================================================== */

  const toggleProducto = useMutation({
    mutationFn: async (producto: Producto) => {
      return setProductoActivo(
        producto._id,
        !producto.activo
      )
    },

    onSuccess: () => {
      // 🔥 refresca Admin, POS, Stock automáticamente
      queryClient.invalidateQueries({ queryKey: ['productos'] })

      setConfirmOpen(false)
      setToToggle(null)
    },
  })

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>

        {canEdit && (
          <button
            onClick={() => {
              setEditing(null)
              setOpenModal(true)
            }}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            + Nuevo producto
          </button>
        )}
      </div>

      {/* Tabla */}
      <ProductosTable
        productos={productos}
        loading={loadingProductos}
        canEdit={canEdit}
        onEdit={prod => {
          setEditing(prod)
          setOpenModal(true)
        }}
        onToggle={prod => {
          setToToggle(prod)
          setConfirmOpen(true)
        }}
      />

      {/* Modal crear / editar */}
      <ProductoModal
        open={openModal}
        producto={editing}
        onClose={() => setOpenModal(false)}
        onSaved={() => {
          // El form ya invalida productos,
          // acá solo cerramos
          setOpenModal(false)
        }}
      />

      {/* Confirmar activar / desactivar */}
      <ConfirmDeactivateModal
        open={confirmOpen}
        loading={toggleProducto.isPending}
        title={
          toToggle?.activo
            ? 'Desactivar producto'
            : 'Reactivar producto'
        }
        description={
          toToggle?.activo
            ? `¿Seguro que deseas desactivar "${toToggle?.nombre}"?`
            : `¿Deseas reactivar "${toToggle?.nombre}"?`
        }
        confirmLabel={
          toToggle?.activo ? 'Desactivar' : 'Reactivar'
        }
        onCancel={() => {
          setConfirmOpen(false)
          setToToggle(null)
        }}
        onConfirm={() => {
          if (toToggle) {
            toggleProducto.mutate(toToggle)
          }
        }}
      />
    </div>
  )
}