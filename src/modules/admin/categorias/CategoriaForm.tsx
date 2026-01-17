import { useEffect, useState } from 'react'
import type {
  Categoria,
  TipoCategoria,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
} from '@/shared/types/categoria.types'
import {
  createCategoria,
  updateCategoria,
} from '@/shared/api/categoria.api'

type Props = {
  categoria: Categoria | null
  onSaved: () => void
}

export default function CategoriaForm({ categoria, onSaved }: Props) {
  const isEdit = Boolean(categoria)

  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [color, setColor] = useState('')
  const [tipo, setTipo] = useState<TipoCategoria>('NORMAL')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (categoria) {
      setNombre(categoria.nombre)
      setDescripcion(categoria.descripcion || '')
      setColor(categoria.color || '')
      setTipo(categoria.tipo)
    } else {
      setNombre('')
      setDescripcion('')
      setColor('')
      setTipo('NORMAL')
    }
  }, [categoria])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    setLoading(true)
    try {
      if (isEdit && categoria) {
        const payload: UpdateCategoriaDTO = {
          nombre,
          descripcion,
          tipo,
          color: color || undefined,
        }

        await updateCategoria(categoria._id, payload)
      } else {
        const payload: CreateCategoriaDTO = {
          nombre,
          descripcion,
          tipo,
          color: color || undefined,
        }

        await createCategoria(payload)
      }

      onSaved()
    } catch (err) {
      setError('Error al guardar la categoría')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm mb-1">Nombre *</label>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Ej: Bebidas"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm mb-1">Descripción</label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          disabled={loading}
          rows={3}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          placeholder="Descripción corta de la categoría"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={e =>
            setTipo(e.target.value as TipoCategoria)
          }
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="NORMAL">Normal</option>
          <option value="ALCOHOL">Alcohol</option>
          <option value="SERVICIO">Servicio</option>
          <option value="PROMO">Promoción</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm mb-1">Color (opcional)</label>
        <input
          type="color"
          value={color || '#000000'}
          onChange={e => setColor(e.target.value)}
          disabled={loading}
          className="h-10 w-24 p-1 rounded bg-slate-800 border border-slate-700"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onSaved}
          disabled={loading}
          className="px-4 py-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {loading
            ? 'Guardando...'
            : isEdit
            ? 'Guardar cambios'
            : 'Crear categoría'}
        </button>
      </div>
    </form>
  )
}