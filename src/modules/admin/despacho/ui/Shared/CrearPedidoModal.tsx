import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* ===============================
   Producto picker
=============================== */
import ProductoAutocomplete from '@/shared/producto/ui/ProductoAutocomplete'
import type { Producto } from '@/shared/producto/producto.types'

/* ===============================
   Queries / Hooks existentes
=============================== */
import { useProductosAdmin } from '@/shared/queries/useProductos'
import { useSucursalPrincipal } from '../../hooks/useSucursalPrincipal'

/* ===============================
   API / Types de despacho
=============================== */
import { crearPedidoInterno } from '../../domain/despacho.api'
import type {
  CrearPedidoInternoDTO,
} from '../../domain/despacho.types'

/* ===============================
   Types locales
=============================== */
interface PedidoItemDraft {
  productoId: string
  nombre: string
  cantidadSolicitada: number
}

interface Props {
  onClose: () => void
}

/* =====================================================
   CrearPedidoModal
===================================================== */
export function CrearPedidoModal({ onClose }: Props) {
  const queryClient = useQueryClient()

  /* ===============================
     Data base
  =============================== */
  const { data: productos = [] } = useProductosAdmin()
  const { data: sucursalPrincipal } =
    useSucursalPrincipal()

  /* ===============================
     State local
  =============================== */
  const [items, setItems] = useState<
    PedidoItemDraft[]
  >([])

  /* ===============================
     Mutation
  =============================== */
  const mutation = useMutation({
    mutationFn: (payload: CrearPedidoInternoDTO) =>
      crearPedidoInterno(payload),

    onSuccess: () => {
      // refresca mis pedidos
      queryClient.invalidateQueries({
        queryKey: ['pedidos-propios'],
      })
      onClose()
    },
  })

  /* ===============================
     Handlers
  =============================== */

  const handleAddProducto = (producto: Producto) => {
    setItems(prev => {
      const exists = prev.find(
        i => i.productoId === producto._id
      )
      if (exists) return prev

      return [
        ...prev,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          cantidadSolicitada: 1,
        },
      ]
    })
  }

  const handleChangeCantidad = (
    productoId: string,
    cantidad: number
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? {
              ...item,
              cantidadSolicitada: Math.max(
                1,
                cantidad
              ),
            }
          : item
      )
    )
  }

  const handleRemoveItem = (productoId: string) => {
    setItems(prev =>
      prev.filter(
        item => item.productoId !== productoId
      )
    )
  }

  const handleSubmit = () => {
    if (!sucursalPrincipal) return
    if (items.length === 0) return

    const payload: CrearPedidoInternoDTO = {
      sucursalAbastecedoraId:
        sucursalPrincipal.id,
      items: items.map(item => ({
        productoId: item.productoId,
        cantidadSolicitada:
          item.cantidadSolicitada,
      })),
    }

    mutation.mutate(payload)
    console.log(payload)
  }

  /* ===============================
     Render
  =============================== */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-slate-900 p-6 text-slate-100 space-y-4">
        <h2 className="text-lg font-semibold">
          Crear pedido interno
        </h2>

        {/* ===============================
            Info sucursal abastecedora
        =============================== */}
        {sucursalPrincipal && (
          <div className="text-xs text-slate-400">
            Abastece:{' '}
            <span className="text-slate-200">
              {sucursalPrincipal.nombre}
            </span>
          </div>
        )}

        {/* ===============================
            Selector de productos
        =============================== */}
        <ProductoAutocomplete
          productos={productos}
          onSelect={handleAddProducto}
        />

        {/* ===============================
            Items del pedido
        =============================== */}
        {items.length === 0 ? (
          <div className="text-sm text-slate-400">
            No hay productos agregados
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.productoId}
                className="
                  flex items-center gap-2
                  rounded-lg border border-slate-800
                  px-3 py-2
                "
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {item.nombre}
                  </div>
                </div>

                <input
                  type="number"
                  min={1}
                  value={item.cantidadSolicitada}
                  onChange={e =>
                    handleChangeCantidad(
                      item.productoId,
                      Number(e.target.value)
                    )
                  }
                  className="
                    w-20 rounded-md bg-slate-800
                    px-2 py-1 text-sm
                    text-slate-100 outline-none
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    handleRemoveItem(
                      item.productoId
                    )
                  }
                  className="
                    text-xs text-red-400
                    hover:text-red-300
                  "
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ===============================
            Acciones
        =============================== */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="
              rounded-md border border-slate-700
              px-3 py-1 text-sm
            "
            disabled={mutation.isPending}
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={
              mutation.isPending ||
              items.length === 0 ||
              !sucursalPrincipal
            }
            className="
              rounded-md bg-emerald-600
              px-3 py-1 text-sm
              text-white
              disabled:opacity-50
            "
          >
            {mutation.isPending
              ? 'Creando…'
              : 'Crear pedido'}
          </button>
        </div>
      </div>
    </div>
  )
}