import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  Producto,
  CreateProductoDTO,
  UpdateProductoDTO,
} from '@/shared/types/producto.types'
import type { Categoria } from '@/shared/types/categoria.types'
import type { Proveedor } from '@/shared/types/proveedor.types'

import {
  createProducto,
  updateProducto,
} from '@/shared/api/producto.api'
import { getCategoriasAdmin } from '@/shared/api/categoria.api'
import { api } from '@/shared/api/api'

type Props = {
  producto: Producto | null
  onSaved: () => void
}

export default function ProductoForm({ producto, onSaved }: Props) {
  const isEdit = Boolean(producto)
  const queryClient = useQueryClient()

  /* =====================================================
     FORM STATE (solo datos del formulario, NO datos remotos)
  ===================================================== */

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [precio, setPrecio] = useState<number>(0)
  const [codigo, setCodigo] = useState('')
  const [unidadBase, setUnidadBase] = useState('UNIDAD')

  // 👇 en formularios SIEMPRE IDs (nunca objetos)
  const [categoriaId, setCategoriaId] = useState<string>('')
  const [proveedorId, setProveedorId] = useState<string>('')

  const [error, setError] = useState<string | null>(null)

  /* =====================================================
     QUERIES (datos remotos, cacheados)
  ===================================================== */

  // Categorías (Admin)
  const {
    data: categorias = [],
    isLoading: loadingCategorias,
  } = useQuery<Categoria[]>({
    queryKey: ['categorias', 'admin'],
    queryFn: getCategoriasAdmin,
    staleTime: 10 * 60 * 1000, // muy estático
  })

  // Proveedores
  const {
    data: proveedores = [],
    isLoading: loadingProveedores,
  } = useQuery<Proveedor[]>({
    queryKey: ['proveedores'],
    queryFn: async () => {
      const { data } = await api.get('/proveedores')
      return data
    },
    staleTime: 10 * 60 * 1000,
  })

  /* =====================================================
     MUTATION (crear / actualizar producto)
  ===================================================== */

  const saveProducto = useMutation({
    mutationFn: async () => {
      if (!nombre || !categoriaId || !codigo) {
        throw new Error('Completa los campos obligatorios')
      }

      if (isEdit && producto) {
        const payload: UpdateProductoDTO = {
          nombre,
          descripcion,
          precio,
          codigo,
          unidadBase,
          categoriaId: categoriaId || undefined,
          proveedorId: proveedorId || undefined,
        }

        return updateProducto(producto._id, payload)
      }

      const payload: CreateProductoDTO = {
        nombre,
        descripcion,
        precio,
        codigo,
        unidadBase,
        categoriaId: categoriaId || undefined,
        proveedorId: proveedorId || undefined,
      }

      return createProducto(payload)
    },

    onSuccess: () => {
      // 🔥 invalidamos productos (POS + Admin + Stock se actualizan)
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      onSaved()
    },

    onError: () => {
      setError('Error al guardar el producto')
    },
  })

  /* =====================================================
     LOAD PRODUCTO (modo edición)
     Normalizamos proveedorId a string
  ===================================================== */

  useEffect(() => {
    if (!producto) {
      setNombre('')
      setDescripcion('')
      setPrecio(0)
      setCodigo('')
      setUnidadBase('UNIDAD')
      setCategoriaId('')
      setProveedorId('')
      return
    }

    setNombre(producto.nombre)
    setDescripcion(producto.descripcion ?? '')
    setPrecio(producto.precio)
    setCodigo(producto.codigo ?? '')
    setUnidadBase(producto.unidadBase)
    setCategoriaId(producto.categoriaId ?? '')
    setProveedorId(
      typeof producto.proveedorId === 'string'
        ? producto.proveedorId
        : producto.proveedorId?._id ?? ''
    )
  }, [producto])

  /* =====================================================
     UI HELPERS
  ===================================================== */

  const inputBase =
    'w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-100 ' +
    'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500'

  const labelBase = 'text-xs font-medium text-slate-300'

  const loading =
    loadingCategorias ||
    loadingProveedores ||
    saveProducto.isPending

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        setError(null)
        saveProducto.mutate()
      }}
      className="space-y-5"
    >
      {/* Nombre */}
      <div className="space-y-1">
        <label className={labelBase}>Nombre *</label>
        <input
          className={inputBase}
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1">
        <label className={labelBase}>Descripción</label>
        <textarea
          className={`${inputBase} resize-none`}
          rows={3}
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>

      {/* Precio + Unidad */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className={labelBase}>Precio *</label>
          <input
            type="number"
            min={0}
            className={inputBase}
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
          />
        </div>

        <div className="space-y-1">
          <label className={labelBase}>Unidad base</label>
          <select
            className={inputBase}
            value={unidadBase}
            onChange={e => setUnidadBase(e.target.value)}
          >
            <option value="UNIDAD">Unidad</option>
            <option value="KG">Kilogramo</option>
            <option value="LT">Litro</option>
          </select>
        </div>
      </div>

      {/* Categoría */}
      <div className="space-y-1">
        <label className={labelBase}>Categoría *</label>
        <select
          className={inputBase}
          value={categoriaId}
          onChange={e => setCategoriaId(e.target.value)}
        >
          <option value="">Selecciona categoría</option>
          {categorias.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Proveedor */}
      <div className="space-y-1">
        <label className={labelBase}>Proveedor</label>
        <select
          className={inputBase}
          value={proveedorId}
          onChange={e => setProveedorId(e.target.value)}
        >
          <option value="">— Sin proveedor —</option>
          {proveedores.map(p => (
            <option key={p._id} value={p._id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Código */}
      <div className="space-y-1">
        <label className={labelBase}>Código de barras *</label>
        <input
          className={inputBase}
          value={codigo}
          disabled={isEdit}
          onChange={e => setCodigo(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onSaved}
          className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          {loading
            ? 'Guardando…'
            : isEdit
            ? 'Guardar cambios'
            : 'Crear producto'}
        </button>
      </div>
    </form>
  )
}