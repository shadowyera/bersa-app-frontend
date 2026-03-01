import type { VentaAdmin } from '@/domains/venta/domain/venta-admin.types'
import { useNavigate } from 'react-router-dom'
import VentaEstadoBadge from './VentaEstadoBadge'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import { Badge } from '@/shared/ui/badge/badge'

interface Props {
  ventas: VentaAdmin[]
}

export default function VentasTable({ ventas }: Props) {

  const navigate = useNavigate()

  if (ventas.length === 0) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        No hay ventas para mostrar
      </div>
    )
  }

  return (
    <Table className="flex flex-col overflow-hidden">

      <TableContent>

        <TableHeader className="sticky top-0 z-10 bg-surface border-b border-border">
          <TableRow>
            <TableHead>Folio</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead className="text-right">
              Total
            </TableHead>
            <TableHead className="text-center">
              Estado
            </TableHead>
            <TableHead className="text-right">
              Acción
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {ventas.map(v => (

            <TableRow
              key={v.id}
              onClick={() =>
                navigate(`/admin/ventas/${v.id}`)
              }
              className="cursor-pointer"
            >

              <TableCell className="font-mono">
                {v.folio}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {new Date(v.createdAt).toLocaleString()}
              </TableCell>

              <TableCell>
                <Badge variant="outline">
                  {v.documentoTributario.tipo}
                </Badge>
              </TableCell>

              <TableCell className="text-right font-medium">
                ${v.totalCobrado.toLocaleString()}
              </TableCell>

              <TableCell className="text-center">
                <VentaEstadoBadge estado={v.estado} />
              </TableCell>

              <TableCell className="text-right">
                <span className="text-primary hover:opacity-80">
                  Ver
                </span>
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </TableContent>

    </Table>
  )
}