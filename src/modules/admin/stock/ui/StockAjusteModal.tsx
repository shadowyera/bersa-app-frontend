import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (cantidad: number, motivo: string) => void
}

export function StockAjusteModal({
  open,
  onClose,
  onConfirm,
}: Props) {

  const [cantidad, setCantidad] = useState(0)
  const [motivo, setMotivo] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-slate-900 w-full max-w-md rounded-lg p-6 space-y-4">

        <h2 className="text-lg font-semibold">
          Ajustar Stock
        </h2>

        <input
          type="number"
          value={cantidad}
          onChange={e =>
            setCantidad(Number(e.target.value))
          }
          className="w-full bg-slate-800 px-3 py-2 rounded"
          placeholder="Ej: +10 o -5"
        />

        <textarea
          value={motivo}
          onChange={e => setMotivo(e.target.value)}
          className="w-full bg-slate-800 px-3 py-2 rounded"
          placeholder="Motivo del ajuste"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 rounded"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              onConfirm(cantidad, motivo)
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 rounded"
          >
            Confirmar
          </button>
        </div>

      </div>
    </div>
  )
}