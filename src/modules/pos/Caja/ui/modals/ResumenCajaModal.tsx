import ModalBase from './ModalBase'
import { useResumenCaja } from '../../hooks/useResumenCaja'

interface Props {
  cajaId: string
  onClose: () => void
}

export default function ResumenCajaModal({
  cajaId,
  onClose,
}: Props) {
  const { data, loading, refresh } = useResumenCaja(cajaId)

  if (!cajaId) return null

  return (
    <ModalBase
      title="📊 Resumen de Caja"
      onClose={onClose}
    >
      {loading && (
        <div className="text-center py-8 text-slate-400">
          Cargando…
        </div>
      )}

      {!loading && data && (
        <>
          <div className="space-y-3 text-sm">
            <Fila label="Monto inicial" value={data.montoInicial} />
            <Fila label="Total ventas" value={data.totalVentas} />
            <Fila label="Efectivo por ventas" value={data.efectivoVentas} />

            <div className="border-t border-slate-700 my-2" />

            <Fila
              label="Efectivo esperado"
              value={data.efectivoEsperado}
              bold
            />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={refresh}
              className="px-6 py-2 bg-slate-700 rounded"
            >
              Actualizar
            </button>

            <button
              onClick={onClose}
              className="px-6 py-2 bg-emerald-600 rounded"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </ModalBase>
  )
}

function Fila({
  label,
  value,
  bold,
}: {
  label: string
  value: number
  bold?: boolean
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? 'text-lg font-bold' : ''
      }`}
    >
      <span>{label}</span>
      <span>${value.toLocaleString()}</span>
    </div>
  )
}