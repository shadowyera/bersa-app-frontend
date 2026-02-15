import { useFactura } from '../hooks/useFactura'
import { useFacturaForm } from '../hooks/useFacturaForm'

interface Props {
  open: boolean
  onClose: () => void
  ventaId: string
  onSuccess?: () => void
}

export default function FacturaModal({
  open,
  onClose,
  ventaId,
  onSuccess,
}: Props) {

  const {
    crearFactura,
    loading,
    error,
  } = useFactura()

  const form =
    useFacturaForm(ventaId)

  async function handleConfirm() {

    const payload =
      form.buildPayload()

    await crearFactura(payload)

    if (onSuccess) {
      onSuccess()
    }

    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="
        relative
        w-full
        max-w-3xl
        rounded-2xl
        bg-slate-900
        border
        border-slate-700
        shadow-2xl
        p-6
      ">

        <h2 className="text-lg font-semibold text-slate-100 mb-5">
          Emitir Factura
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="RUT"
            value={form.receptor.rut}
            onChange={e =>
              form.updateReceptor(
                'rut',
                e.target.value
              )
            }
          />

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Razón Social"
            value={form.receptor.razonSocial}
            onChange={e =>
              form.updateReceptor(
                'razonSocial',
                e.target.value
              )
            }
          />

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Giro"
            value={form.receptor.giro}
            onChange={e =>
              form.updateReceptor(
                'giro',
                e.target.value
              )
            }
          />

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Dirección"
            value={form.receptor.direccion}
            onChange={e =>
              form.updateReceptor(
                'direccion',
                e.target.value
              )
            }
          />

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Comuna"
            value={form.receptor.comuna}
            onChange={e =>
              form.updateReceptor(
                'comuna',
                e.target.value
              )
            }
          />

          <input
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ciudad"
            value={form.receptor.ciudad}
            onChange={e =>
              form.updateReceptor(
                'ciudad',
                e.target.value
              )
            }
          />

        </div>

        <div className="mb-6">

          <div className="flex justify-between items-center mb-3">
            <span className="font-medium text-slate-200">
              Ítems
            </span>
            <button
              className="text-emerald-400 hover:text-emerald-300 text-sm"
              onClick={form.addItem}
            >
              + Agregar
            </button>
          </div>

          {form.items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 gap-2 mb-2"
            >

              <input
                className="col-span-6 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Descripción"
                value={item.descripcion}
                onChange={e =>
                  form.updateItem(
                    idx,
                    'descripcion',
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                className="col-span-2 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={item.cantidad}
                onChange={e =>
                  form.updateItem(
                    idx,
                    'cantidad',
                    Number(e.target.value)
                  )
                }
              />

              <input
                type="number"
                className="col-span-3 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={item.precioUnitario}
                onChange={e =>
                  form.updateItem(
                    idx,
                    'precioUnitario',
                    Number(e.target.value)
                  )
                }
              />

              <button
                className="col-span-1 text-red-400 hover:text-red-300"
                onClick={() =>
                  form.removeItem(idx)
                }
              >
                ✕
              </button>

            </div>
          ))}

        </div>

        <div className="flex items-center gap-4 mb-6">

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.aplicarIva}
              onChange={e =>
                form.setAplicarIva(
                  e.target.checked
                )
              }
            />
            Aplicar IVA
          </label>

          <input
            type="number"
            step="0.01"
            className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={form.ivaRate}
            onChange={e =>
              form.setIvaRate(
                Number(e.target.value)
              )
            }
          />

        </div>

        {error && (
          <div className="text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">

          <button
            className="
              px-4
              py-2
              rounded
              bg-slate-700
              hover:bg-slate-600
              text-slate-200
              transition
            "
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            className="
              px-4
              py-2
              rounded
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              font-medium
              transition
              disabled:opacity-50
            "
            onClick={handleConfirm}
          >
            {loading
              ? 'Generando...'
              : 'Emitir'}
          </button>

        </div>

      </div>

    </div>
  )
}