import { useState } from 'react'

import { useProductosPOSQuery } from '@/domains/producto/hooks/useProductosQuery'
import { useProductoFilter } from '@/domains/producto/hooks/useProductoFilter'
import ProductoSearchInput from '@/domains/producto/ui/ProductoSearchInput'

import { useAbastecimiento } from '../hooks/useAbastecimiento'
import { AbastecimientoItems } from './AbastecimientoItems'
import ProductoPicker from '@/modules/admin/abastecimiento/ui/ProductoPicker'

/**
 * IngresoAbastecimiento
 *
 * Flujo de ingreso de stock:
 * - Los productos vienen desde useProductosAdmin (cache)
 * - La búsqueda es externa (query)
 * - El filtrado se hace con useProductoFilter
 * - El picker SOLO renderiza productos ya filtrados
 */
const IngresoAbastecimiento = () => {
  /* ===============================
     Productos (cache admin)
  =============================== */
  const { data: productos = [], isLoading } =
    useProductosPOSQuery()

  /* ===============================
     Abastecimiento (dominio)
  =============================== */
  const {
    items,
    addProducto,
    setCantidad,
    removeProducto,
    observacion,
    setObservacion,
    confirmarIngreso,
    loading,
  } = useAbastecimiento()

  /* ===============================
     Búsqueda
  =============================== */
  const [query, setQuery] = useState('')

  const productosFiltrados = useProductoFilter(
    productos,
    query
  )

  /* ===============================
     Selección de producto
     - Agrega al abastecimiento
     - Limpia la búsqueda
  =============================== */
  const handleSelectProducto = (producto: any) => {
    addProducto(producto)
    setQuery('')
  }

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Cargando productos…
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* ===============================
          IZQUIERDA
      =============================== */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Ingreso de stock
          </h1>
          <p className="text-sm text-slate-400">
            Agrega uno o más productos para ingresar a bodega
          </p>
        </div>

        {/* ===============================
            Selector de productos
        =============================== */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 space-y-2">
          {/* Search */}
          <ProductoSearchInput
            placeholder="Buscar producto por código o nombre"
            value={query}
            onChange={setQuery}
            className="w-full px-3 py-2"
          />

          {/* Picker */}
          {query && productosFiltrados.length > 0 && (
            <ProductoPicker
              products={productosFiltrados}
              onSelect={handleSelectProducto}
            />
          )}

          {query && productosFiltrados.length === 0 && (
            <div className="text-sm text-slate-500 px-2 py-3">
              No se encontraron productos
            </div>
          )}
        </div>

        {/* ===============================
            Items agregados
        =============================== */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <AbastecimientoItems
            items={items}
            setCantidad={setCantidad}
            removeProducto={removeProducto}
          />
        </div>

        {/* ===============================
            Observación
        =============================== */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <label className="mb-2 block text-sm text-slate-300">
            Observación (opcional)
          </label>
          <textarea
            value={observacion}
            onChange={(e) =>
              setObservacion(e.target.value)
            }
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100"
          />
        </div>
      </div>

      {/* ===============================
          DERECHA
      =============================== */}
      <div className="space-y-4">
        <div className="sticky top-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="mb-4 text-sm font-medium text-slate-200">
            Confirmar ingreso
          </h2>

          <div className="mb-4 flex justify-between text-sm text-slate-300">
            <span>Productos</span>
            <span className="font-medium">
              {items.length}
            </span>
          </div>

          <button
            disabled={!items.length || loading}
            onClick={confirmarIngreso}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold ${
              !items.length || loading
                ? 'bg-slate-700 text-slate-400'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
          >
            {loading
              ? 'Registrando ingreso…'
              : 'Confirmar ingreso'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default IngresoAbastecimiento