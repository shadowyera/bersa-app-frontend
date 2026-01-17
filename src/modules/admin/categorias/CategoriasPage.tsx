import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import type { Categoria } from '@/shared/types/categoria.types'

import {
  getCategoriasAdmin,
  setCategoriaActiva,
} from '@/shared/api/categoria.api'

import CategoriasTable from './CategoriasTable'
import CategoriaModal from './CategoriaModal'
import ConfirmDeactivateModal from '../ConfirmDeactivateModal'

export default function CategoriasPage() {
  const { user } = useAuth()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(false)

  // modal crear / editar
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)

  // confirm activar / desactivar
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toToggle, setToToggle] = useState<Categoria | null>(null)
  const [toggling, setToggling] = useState(false)

  const canEdit =
    user?.rol === 'ADMIN' || user?.rol === 'ENCARGADO'

  const load = async () => {
    setLoading(true)
    try {
      const data = await getCategoriasAdmin()
      setCategorias(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // acciones
  const onNueva = () => {
    setEditing(null)
    setOpenModal(true)
  }

  const onEditar = (cat: Categoria) => {
    setEditing(cat)
    setOpenModal(true)
  }

  const onAskToggle = (cat: Categoria) => {
    setToToggle(cat)
    setConfirmOpen(true)
  }

  const onConfirmToggle = async () => {
    if (!toToggle) return

    setToggling(true)
    try {
      await setCategoriaActiva(
        toToggle._id,
        !toToggle.activo
      )
      setConfirmOpen(false)
      setToToggle(null)
      load()
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>

        {canEdit && (
          <button
            onClick={onNueva}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            + Nueva categoría
          </button>
        )}
      </div>

      {/* Tabla */}
      <CategoriasTable
        categorias={categorias}
        loading={loading}
        canEdit={canEdit}
        onEdit={onEditar}
        onToggle={onAskToggle}
      />

      {/* Modal crear / editar */}
      <CategoriaModal
        open={openModal}
        categoria={editing}
        onClose={() => {
          setOpenModal(false)
          setEditing(null)
        }}
        onSaved={() => {
          load()
        }}
      />

      {/* Confirm activar / desactivar */}
      <ConfirmDeactivateModal
        open={confirmOpen}
        loading={toggling}
        title={
          toToggle?.activo
            ? 'Desactivar categoría'
            : 'Reactivar categoría'
        }
        description={
          toToggle?.activo
            ? `¿Seguro que deseas desactivar la categoría "${toToggle?.nombre}"?`
            : `¿Deseas reactivar la categoría "${toToggle?.nombre}"?`
        }
        confirmLabel={
          toToggle?.activo ? 'Desactivar' : 'Reactivar'
        }
        onCancel={() => {
          setConfirmOpen(false)
          setToToggle(null)
        }}
        onConfirm={onConfirmToggle}
      />
    </div>
  )
}