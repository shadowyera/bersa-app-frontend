import { memo } from 'react'

interface Props {
  nombre: string
  precio: number
  activo: boolean
  stock: number

  /**
   * Acción pura:
   * - agregar producto
   * - NO sabe nada del scanner
   */
  onAdd: () => void
}

function ProductCard({
  nombre,
  precio,
  activo,
  stock,
  onAdd,
}: Props) {
  /* ===============================
     Estado visual derivado
  =============================== */
  const bloqueado = !activo
  const agotado = activo && stock <= 0

  /* ===============================
     Render
  =============================== */
  return (
    <button
      disabled={bloqueado}
      onMouseDown={e => {
        e.preventDefault()
        if (bloqueado) return
        onAdd()
      }}
      className={`
        p-3 rounded text-left transition
        ${
          bloqueado
            ? 'bg-slate-700 opacity-40 cursor-not-allowed'
            : agotado
            ? 'bg-slate-800 ring-2 ring-red-500 hover:bg-slate-700'
            : 'bg-slate-800 hover:bg-slate-700'
        }
      `}
    >
      <div className="font-medium">
        {nombre}
      </div>

      <div className="text-sm text-slate-400">
        ${precio.toLocaleString('es-CL')}
      </div>

      {agotado && (
        <div className="text-xs text-red-400 mt-1">
          Agotado
        </div>
      )}

      {bloqueado && (
        <div className="text-xs text-slate-500 mt-1">
          No habilitado
        </div>
      )}
    </button>
  )
}

/**
 * Memo:
 * - rerenderiza solo si cambian props reales
 */
export default memo(ProductCard)