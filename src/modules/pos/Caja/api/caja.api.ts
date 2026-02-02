import { api } from '@/shared/api/api'
import type { AperturaCaja, Caja } from '../domain/caja.types'
import { ESTADO_APERTURA_CAJA } from '../domain/caja.types'

/* =====================================================
   DTOs backend
===================================================== */

interface CajaDTO {
  id?: string
  _id?: string
  nombre: string
  sucursalId: string
  activa: boolean
}

interface AperturaCajaDTO {
  id?: string
  _id?: string

  cajaId: string
  sucursalId: string

  usuarioAperturaId: string
  usuarioAperturaNombre?: string
  usuarioCierreId?: string

  fechaApertura: string
  montoInicial: number

  fechaCierre?: string
  montoFinal?: number
  diferencia?: number

  estado: string
}

/* =====================================================
   Normalizadores
===================================================== */

function normalizarCaja(dto: CajaDTO): Caja {
  return {
    id: String(dto.id ?? dto._id),
    nombre: dto.nombre,
    sucursalId: String(dto.sucursalId),
    activa: Boolean(dto.activa),
  }
}

function normalizarApertura(
  dto: AperturaCajaDTO
): AperturaCaja {
  return {
    id: String(dto.id ?? dto._id),
    cajaId: dto.cajaId,
    sucursalId: dto.sucursalId,

    usuarioAperturaId: dto.usuarioAperturaId,
    usuarioAperturaNombre: dto.usuarioAperturaNombre,

    usuarioCierreId: dto.usuarioCierreId,

    fechaApertura: dto.fechaApertura,
    montoInicial: dto.montoInicial,

    fechaCierre: dto.fechaCierre,
    montoFinal: dto.montoFinal,
    diferencia: dto.diferencia,

    estado:
      dto.estado as typeof ESTADO_APERTURA_CAJA[keyof typeof ESTADO_APERTURA_CAJA],
  }
}

/* =====================================================
   API — LECTURA GLOBAL
===================================================== */

export async function getCajasSucursal(
  sucursalId: string
): Promise<Caja[]> {
  const { data } = await api.get<CajaDTO[]>(
    '/cajas',
    { params: { sucursalId } }
  )

  return data.map(normalizarCaja)
}

export async function getAperturasActivasSucursal(
  sucursalId: string
): Promise<AperturaCaja[]> {
  const { data } = await api.get<AperturaCajaDTO[]>(
    '/aperturas/activas',
    { params: { sucursalId } }
  )

  return data.map(normalizarApertura)
}

/* =====================================================
   API — CAJA INDIVIDUAL
===================================================== */

export async function getAperturaActiva(
  cajaId: string
): Promise<AperturaCaja | null> {
  const { data } = await api.get<AperturaCajaDTO | null>(
    `/cajas/${cajaId}/apertura-activa`
  )

  if (!data) return null
  return normalizarApertura(data)
}

export async function abrirCaja(params: {
  cajaId: string
  montoInicial: number
}): Promise<AperturaCaja> {
  const { data } = await api.post<AperturaCajaDTO>(
    `/cajas/${params.cajaId}/abrir`,
    { montoInicial: params.montoInicial }
  )

  return normalizarApertura(data)
}

export async function getResumenPrevioCaja(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/resumen-previo`
  )
  return data
}

export async function cerrarCajaAutomatico(params: {
  cajaId: string
  montoFinal: number
}) {
  await api.post(
    `/cajas/${params.cajaId}/cierre`,
    { montoFinal: params.montoFinal }
  )
}