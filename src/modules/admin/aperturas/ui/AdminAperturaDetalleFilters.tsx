import { useState } from 'react'

import { Surface } from '@/shared/ui/surface/Surface'
import { Select } from '@/shared/ui/select/select'
import { Input } from '@/shared/ui/input/input'

export type VentaEstado = 'FINALIZADA' | 'ANULADA'
export type TipoDocumento = 'BOLETA' | 'FACTURA'
export type TipoPago =
  | 'EFECTIVO'
  | 'DEBITO'
  | 'CREDITO'
  | 'TRANSFERENCIA'
  | 'MIXTO'

export interface AperturaDetalleFilters {
  estado?: VentaEstado
  documento?: TipoDocumento
  pago?: TipoPago
  search?: string
}

interface Props {
  onChange: (filters: AperturaDetalleFilters) => void
}

export function AdminAperturaDetalleFilters({
  onChange,
}: Props) {

  const [estado, setEstado] =
    useState<VentaEstado | ''>('')

  const [documento, setDocumento] =
    useState<TipoDocumento | ''>('')

  const [pago, setPago] =
    useState<TipoPago | ''>('')

  const [search, setSearch] =
    useState('')

  const emit = (
    next: Partial<AperturaDetalleFilters>
  ) => {
    onChange(next)
  }

  return (
    <Surface
      className="
        px-4 py-3
        bg-surface/40
        flex
        items-center
        gap-3
      "
    >

      {/* Grupo izquierdo */}
      <div className="flex items-center gap-3 flex-shrink-0">

        <Select
          selectSize="sm"
          value={estado}
          onChange={(e) => {
            const v =
              e.target.value as VentaEstado | ''
            setEstado(v)
            emit({ estado: v || undefined })
          }}
          className="min-w-[180px]"
        >
          <option value="">
            Todos los estados
          </option>
          <option value="FINALIZADA">
            Finalizada
          </option>
          <option value="ANULADA">
            Anulada
          </option>
        </Select>

        <Select
          selectSize="sm"
          value={documento}
          onChange={(e) => {
            const v =
              e.target.value as TipoDocumento | ''
            setDocumento(v)
            emit({ documento: v || undefined })
          }}
          className="min-w-[180px]"
        >
          <option value="">
            Todos los documentos
          </option>
          <option value="BOLETA">
            Boleta
          </option>
          <option value="FACTURA">
            Factura
          </option>
        </Select>

        <Select
          selectSize="sm"
          value={pago}
          onChange={(e) => {
            const v =
              e.target.value as TipoPago | ''
            setPago(v)
            emit({ pago: v || undefined })
          }}
          className="min-w-[180px]"
        >
          <option value="">
            Todos los pagos
          </option>
          <option value="EFECTIVO">
            Efectivo
          </option>
          <option value="DEBITO">
            Débito
          </option>
          <option value="CREDITO">
            Crédito
          </option>
          <option value="TRANSFERENCIA">
            Transferencia
          </option>
          <option value="MIXTO">
            Mixto
          </option>
        </Select>

      </div>

      {/* Input a la derecha */}
      <Input
        inputSize="sm"
        type="text"
        placeholder="Buscar folio..."
        value={search}
        onChange={(e) => {
          const v = e.target.value
          setSearch(v)
          emit({ search: v || undefined })
        }}
        className="w-72 ml-auto"
      />

    </Surface>
  )
}