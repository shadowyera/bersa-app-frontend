import { memo, useCallback, useState } from 'react'
import { useCaja } from '../../context/CajaProvider'
import { useCajaBarra } from '../../hooks/useCajaBarra'
import ResumenCajaModal from './ResumenCajaModal'
import { Button } from '@/shared/ui/button/button'

function BarraCajaActiva() {
  const [showCorte, setShowCorte] = useState(false)

  const barra = useCajaBarra()
  const { iniciarCierre, cargando, closingCaja } =
    useCaja()

  const disabled = cargando || closingCaja

  const handleOpenCorte = useCallback(
    () => setShowCorte(true),
    []
  )

  const handleCloseCorte = useCallback(
    () => setShowCorte(false),
    []
  )

  const handleCerrarCaja = useCallback(() => {
    iniciarCierre()
  }, [iniciarCierre])

  if (!barra.visible) return null

  return (
    <>
      <div className="bg-surface border-b border-border">
        <div className="px-6 h-12 flex items-center justify-between">

          {/* Info caja */}
          <div className="flex items-center gap-4 text-sm">

            <div className="flex items-center gap-2 text-success font-medium">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span>{barra.nombreCaja}</span>
            </div>

            <span className="text-muted-foreground">·</span>

            <span className="text-muted-foreground">
              Abierta {barra.horaApertura}
            </span>

          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenCorte}
            >
              Ver resumen
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleCerrarCaja}
              disabled={disabled}
            >
              {closingCaja
                ? 'Cerrando…'
                : 'Cerrar caja'}
            </Button>

          </div>

        </div>
      </div>

      {showCorte && (
        <ResumenCajaModal
          cajaId={barra.cajaId}
          onClose={handleCloseCorte}
        />
      )}
    </>
  )
}

export default memo(BarraCajaActiva)