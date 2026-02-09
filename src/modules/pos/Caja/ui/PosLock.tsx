import { memo } from 'react'

interface PosLockProps {
  open: boolean
  children: React.ReactNode
}

/**
 * PosLock
 *
 * Overlay de bloqueo del POS.
 *
 * - Renderiza a sus hijos centrados
 * - Bloquea interacción con el contenido inferior
 * - No maneja estado ni lógica
 */
function PosLock({ open, children }: PosLockProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-sm pointer-events-none">
      <div className="w-full h-full flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  )
}

export default memo(PosLock)