import { useState } from 'react'
import ProductoPicker from './ProductoPicker'
import { registrarMovimientoStock } from './abastecimiento.api'
import type {
  TipoOperacionAbastecimiento,
  ProductoLineaAbastecimiento,
} from './abastecimiento.types'
import { useAuth } from '@/modules/auth/useAuth'
import { useSucursales } from '@/shared/hooks/useSucursales'

export default function AbastecimientoForm() {
  const { user } = useAuth()
  const { sucursales } = useSucursales()

  if (!user) return null

  const sucursalActualId = user.sucursalId

  const [tipo, setTipo] =
    useState<TipoOperacionAbastecimiento>('RECEPCION')
  const [productos, setProductos] =
    useState<ProductoLineaAbastecimiento[]>([])
  const [observacion, setObservacion] = useState('')
  const [loading, setLoading] = useState(false)
  const [sucursalDestinoId, setSucursalDestinoId] =
    useState('')

  const addProducto = (producto: {
    _id: string
    nombre: string
  }) => {
    setProductos(prev => {
      const existe = prev.find(
        p => p.productoId === producto._id
      )
      if (existe) {
        return prev.map(p =>
          p.productoId === producto._id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      }
      return [
        ...prev,
        {
          productoId: producto._id,
          nombre: producto.nombre,
          cantidad: 1,
          unidadesPorPack: 1,
        },
      ]
    })
  }

  const onSubmit = async () => {
    if (!productos.length) return
    if (tipo === 'TRANSFERENCIA' && !sucursalDestinoId)
      return

    setLoading(true)

    try {
      for (const item of productos) {
        const cantidadReal =
          item.cantidad * (item.unidadesPorPack ?? 1)

        if (tipo === 'RECEPCION') {
          await registrarMovimientoStock({
            tipoMovimiento: 'INGRESO',
            subtipoMovimiento: 'COMPRA_PROVEEDOR',
            productoId: item.productoId,
            sucursalId: sucursalActualId,
            cantidad: cantidadReal,
            observacion,
            referencia: { tipo: 'COMPRA' },
          })
        }

        if (tipo === 'TRANSFERENCIA') {
          await registrarMovimientoStock({
            tipoMovimiento: 'EGRESO',
            subtipoMovimiento: 'TRANSFERENCIA_ENVIO',
            productoId: item.productoId,
            sucursalId: sucursalActualId,
            cantidad: cantidadReal,
            observacion,
            referencia: { tipo: 'TRANSFERENCIA' },
          })

          await registrarMovimientoStock({
            tipoMovimiento: 'INGRESO',
            subtipoMovimiento:
              'TRANSFERENCIA_RECEPCION',
            productoId: item.productoId,
            sucursalId: sucursalDestinoId,
            cantidad: cantidadReal,
            observacion,
            referencia: { tipo: 'TRANSFERENCIA' },
          })
        }
      }

      setProductos([])
      setObservacion('')
      setSucursalDestinoId('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">
        Abastecimiento
      </h2>

      <select
        value={tipo}
        onChange={e =>
          setTipo(
            e.target.value as TipoOperacionAbastecimiento
          )
        }
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
      >
        <option value="RECEPCION">
          Recepción de mercadería
        </option>
        <option value="TRANSFERENCIA">
          Transferencia
        </option>
      </select>

      {tipo === 'TRANSFERENCIA' && (
        <select
          value={sucursalDestinoId}
          onChange={e =>
            setSucursalDestinoId(e.target.value)
          }
          className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
        >
          <option value="">Sucursal destino</option>
          {sucursales
            .filter(s => s._id !== sucursalActualId)
            .map(s => (
              <option key={s._id} value={s._id}>
                {s.nombre}
              </option>
            ))}
        </select>
      )}

      <ProductoPicker onSelect={addProducto} />

      {productos.map(p => {
        const total =
          p.cantidad * (p.unidadesPorPack ?? 1)

        return (
          <div
            key={p.productoId}
            className="flex items-center gap-4 bg-slate-800 p-3 rounded"
          >
            {/* Nombre */}
            <div className="flex-1 font-medium text-slate-200">
              {p.nombre}
            </div>

            {/* Cajas */}
            <div className="flex flex-col text-sm">
              <label className="text-xs text-slate-400">
                Cajas
              </label>
              <input
                type="number"
                min={1}
                value={p.cantidad}
                onChange={e =>
                  setProductos(prev =>
                    prev.map(x =>
                      x.productoId === p.productoId
                        ? {
                          ...x,
                          cantidad: Number(e.target.value),
                        }
                        : x
                    )
                  )
                }
                className="w-16 bg-slate-700 rounded px-2 py-1"
              />
            </div>

            <span className="text-slate-400 mt-5">×</span>

            {/* Unidades por caja */}
            <div className="flex flex-col text-sm">
              <label className="text-xs text-slate-400">
                Unid / caja
              </label>
              <input
                type="number"
                min={1}
                value={p.unidadesPorPack ?? 1}
                onChange={e =>
                  setProductos(prev =>
                    prev.map(x =>
                      x.productoId === p.productoId
                        ? {
                          ...x,
                          unidadesPorPack: Number(
                            e.target.value
                          ),
                        }
                        : x
                    )
                  )
                }
                className="w-20 bg-slate-700 rounded px-2 py-1"
              />
            </div>

            {/* Total */}
            <div className="min-w-[80px] text-right">
              <div className="text-xs text-slate-400">
                Total
              </div>
              <div className="font-semibold text-slate-200">
                {total}
              </div>
            </div>
          </div>
        )
      })}

      <textarea
        value={observacion}
        onChange={e => setObservacion(e.target.value)}
        placeholder="Observación"
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
      />

      <button
        disabled={loading}
        onClick={onSubmit}
        className="bg-emerald-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Procesando…' : 'Confirmar'}
      </button>
    </div>
  )
}