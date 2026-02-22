import { useState } from 'react'

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

  /* ==============================
     EMIT DIRECTO
  ============================== */

  const emit = (
    next: Partial<AperturaDetalleFilters>
  ) => {
    onChange(next)
  }

  /* ==============================
     RENDER
  ============================== */

  return (
    <div
      className="
        flex flex-wrap gap-4 items-center
        bg-slate-900/40
        border border-slate-800/60
        rounded-xl
        p-4
      "
    >

      {/* ESTADO */}
      <select
        value={estado}
        onChange={(e) => {
          const v =
            e.target.value as VentaEstado | ''
          setEstado(v)
          emit({ estado: v || undefined })
        }}
        className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md text-sm"
      >
        <option value="">Todos los estados</option>
        <option value="FINALIZADA">Finalizada</option>
        <option value="ANULADA">Anulada</option>
      </select>

      {/* DOCUMENTO */}
      <select
        value={documento}
        onChange={(e) => {
          const v =
            e.target.value as TipoDocumento | ''
          setDocumento(v)
          emit({ documento: v || undefined })
        }}
        className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md text-sm"
      >
        <option value="">Todos los documentos</option>
        <option value="BOLETA">Boleta</option>
        <option value="FACTURA">Factura</option>
      </select>

      {/* PAGO */}
      <select
        value={pago}
        onChange={(e) => {
          const v =
            e.target.value as TipoPago | ''
          setPago(v)
          emit({ pago: v || undefined })
        }}
        className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md text-sm"
      >
        <option value="">Todos los pagos</option>
        <option value="EFECTIVO">Efectivo</option>
        <option value="DEBITO">Débito</option>
        <option value="CREDITO">Crédito</option>
        <option value="TRANSFERENCIA">Transferencia</option>
        <option value="MIXTO">Mixto</option>
      </select>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Buscar folio..."
        value={search}
        onChange={(e) => {
          const v = e.target.value
          setSearch(v)
          emit({ search: v || undefined })
        }}
        className="
          bg-slate-800
          text-slate-200
          px-3 py-2
          rounded-md
          text-sm
          min-w-[220px]
        "
      />

    </div>
  )
}