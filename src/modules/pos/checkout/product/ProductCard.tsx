import { memo, useCallback } from "react"
import { CardInteractive } from "@/shared/ui/card/Card"

interface Props {
  nombre: string
  precio: number
  activo: boolean
  stock: number
  onAdd: () => void
}

function ProductCard({
  nombre,
  precio,
  activo,
  stock,
  onAdd,
}: Props) {
  const bloqueado = !activo
  const agotado = activo && stock <= 0

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (bloqueado) return
      onAdd()
    },
    [bloqueado, onAdd]
  )

  return (
    <CardInteractive
      disabled={bloqueado}
      onMouseDown={handleMouseDown}
      aria-disabled={bloqueado}
      className={`
        p-4
        ${
          bloqueado
            ? "opacity-40 cursor-not-allowed"
            : ""
        }
      `}
    >
      <div className="font-medium text-foreground">
        {nombre}
      </div>

      <div className="text-sm text-foreground/60 mt-1">
        ${precio.toLocaleString("es-CL")}
      </div>

      {agotado && (
        <div className="mt-2 inline-flex items-center rounded-md bg-red-500/15 px-2 py-0.5 text-xs text-red-400">
          Agotado
        </div>
      )}

      {bloqueado && (
        <div className="mt-2 text-xs text-foreground/40">
          No habilitado
        </div>
      )}
    </CardInteractive>
  )
}

export default memo(ProductCard)