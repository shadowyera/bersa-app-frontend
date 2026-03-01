import type { Producto } from '@/domains/producto/domain/producto.types'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import { Button } from '@/shared/ui/button/button'
import { Badge } from '@/shared/ui/badge/badge'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'

type Props = {
  productos: Producto[]
  loading?: boolean
  canEdit: boolean
  onEdit: (producto: Producto) => void
  onToggle: (producto: Producto) => void
}

export default function ProductosTable({
  productos,
  loading = false,
  canEdit,
  onEdit,
  onToggle,
}: Props) {
  const getProveedorNombre = (proveedor?: string) => {
    if (!proveedor) return '—'
    return proveedor
  }

  return (
    <Table>
      <TableContent>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">
              Precio
            </TableHead>
            <TableHead className="w-[110px]">
              Estado
            </TableHead>
            <TableHead className="w-[200px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* Loading */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {/* Empty */}
          {!loading && productos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-6"
              >
                No hay productos registrados
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}
          {!loading &&
            productos.map(prod => (
              <TableRow
                key={prod.id}
                className={!prod.activo ? 'bg-muted/20' : ''}
              >
                {/* Código */}
                <TableCell className="text-muted-foreground font-mono">
                  {prod.codigo || '—'}
                </TableCell>

                {/* Nombre */}
                <TableCell className="font-medium">
                  {prod.nombre}
                </TableCell>

                {/* Proveedor */}
                <TableCell className="text-muted-foreground">
                  {getProveedorNombre(prod.proveedorId)}
                </TableCell>

                {/* Precio */}
                <TableCell className="text-right">
                  ${prod.precio.toLocaleString('es-CL')}
                </TableCell>

                {/* Estado */}
                <TableCell className="w-[110px]">
                  <Badge
                    variant={
                      prod.activo
                        ? 'success'
                        : 'danger'
                    }
                    className="min-w-[72px] justify-center"
                  >
                    {prod.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </Badge>
                </TableCell>

                {/* Acciones */}
                <TableCell className="w-[200px]">
                  {canEdit && (
                    <div className="flex justify-end gap-2">
                      {/* Editar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(prod)}
                      >
                        Editar
                      </Button>

                      {/* Toggle (MISMO variant SIEMPRE) */}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`
    w-[110px] 
    justify-center
    ${prod.activo
                            ? 'text-danger border-danger/40 hover:bg-danger/10'
                            : 'text-success border-success/40 hover:bg-success/10'
                          }
  `}
                        onClick={() => onToggle(prod)}
                      >
                        {prod.activo ? 'Desactivar' : 'Reactivar'}
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </TableContent>
    </Table>
  )
}