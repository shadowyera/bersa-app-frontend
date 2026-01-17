import { useEffect, useState } from 'react'
import type {
  Proveedor,
  CreateProveedorDTO,
  UpdateProveedorDTO,
} from '@/shared/types/proveedor.types'
import {
  createProveedor,
  updateProveedor,
} from '@/shared/api/proveedores.api'

type Props = {
  proveedor: Proveedor | null
  onSaved: () => void
}

export default function ProveedorForm({
  proveedor,
  onSaved,
}: Props) {
  const isEdit = Boolean(proveedor)

  const [nombre, setNombre] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre)
    } else {
      setNombre('')
    }
  }, [proveedor])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('El nombre es obligatorio')
      return
    }

    setLoading(true)
    try {
      if (isEdit && proveedor) {
        const payload: UpdateProveedorDTO = {
          nombre,
        }

        await updateProveedor(proveedor._id, payload)
      } else {
        const payload: CreateProveedorDTO = {
          nombre,
        }

        await createProveedor(payload)
      }

      onSaved()
    } catch (err) {
      setError('Error al guardar el proveedor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm mb-1">
          Nombre *
        </label>
        <input
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Ej: Coca-Cola, CCU, Nestlé"
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
            : 'Crear proveedor'}
        </button>
      </div>
    </form>
  )
}