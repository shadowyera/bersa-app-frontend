import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import type { Proveedor } from '@/shared/types/proveedor.types'
import {
  getProveedores,
  setProveedorActivo,
} from '@/shared/api/proveedores.api'

import ProveedoresTable from './ProveedoresTable'
import ProveedorModal from './ProveedorModal'
import ConfirmDeactivateModal from '../ConfirmDeactivateModal'

export default function ProveedoresPage() {
  const { user } = useAuth()

  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(false)

  // modal crear / editar
  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] = useState<Proveedor | null>(null)

  // confirm activar / desactivar
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toToggle, setToToggle] = useState<Proveedor | null>(null)
  const [toggling, setToggling] = useState(false)

  const canEdit =
    user?.rol === 'ADMIN' || user?.rol === 'ENCARGADO'

  const load = async () => {
    setLoading(true)
    try {
      const data = await getProveedores({
        includeInactive: true,
      })
      setProveedores(data)
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

  const onEditar = (prov: Proveedor) => {
    setEditing(prov)
    setOpenModal(true)
  }

  const onAskToggle = (prov: Proveedor) => {
    setToToggle(prov)
    setConfirmOpen(true)
  }

  const onConfirmToggle = async () => {
    if (!toToggle) return

    setToggling(true)
    try {
      await setProveedorActivo(
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
        <h1 className="text-2xl font-bold">Proveedores</h1>

        {canEdit && (
          <button
            onClick={onNueva}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            + Nuevo proveedor
          </button>
        )}
      </div>

      {/* Tabla */}
      <ProveedoresTable
        proveedores={proveedores}
        loading={loading}
        canEdit={canEdit}
        onEdit={onEditar}
        onToggle={onAskToggle}
      />

      {/* Modal crear / editar */}
      <ProveedorModal
        open={openModal}
        proveedor={editing}
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
            ? 'Desactivar proveedor'
            : 'Reactivar proveedor'
        }
        description={
          toToggle?.activo
            ? `¿Seguro que deseas desactivar el proveedor "${toToggle?.nombre}"?`
            : `¿Deseas reactivar el proveedor "${toToggle?.nombre}"?`
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