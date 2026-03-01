import { memo, useCallback } from "react"
import { CardInteractive } from "@/shared/ui/card/Card"
import { Badge } from "@/shared/ui/badge/badge"

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

  // SOLO bloqueamos si está inactivo
  const disabled = bloqueado

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (disabled) return
      onAdd()
    },
    [disabled, onAdd]
  )

  return (
    <CardInteractive
      disabled={disabled}
      onMouseDown={handleMouseDown}
      aria-disabled={disabled}
      className={`
        relative
        p-3
        min-h-[88px]
        flex flex-col justify-between
        transition-all duration-150
        ${
          bloqueado
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:border-primary/40 active:scale-[0.98]"
        }
      `}
    >

      {/* Estados arriba a la derecha */}
      {(agotado || bloqueado) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {agotado && (
            <Badge variant="warning">
              Stock 0
            </Badge>
          )}
          {bloqueado && (
            <Badge variant="outline">
              Inactivo
            </Badge>
          )}
        </div>
      )}

      {/* Nombre */}
      <div className="text-sm font-medium text-foreground line-clamp-2 leading-snug pr-2">
        {nombre}
      </div>

      {/* Precio */}
      <div className="mt-2 text-lg font-bold text-primary">
        ${precio.toLocaleString("es-CL")}
      </div>

    </CardInteractive>
  )
}

export default memo(ProductCard)