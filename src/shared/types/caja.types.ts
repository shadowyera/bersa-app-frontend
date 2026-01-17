export type EstadoCaja = 'ABIERTA' | 'CERRADA'

export interface Caja {
  _id: string
  nombre: string
  sucursalId: string
}

export interface AperturaCaja {
  _id: string
  cajaId: string
  fechaApertura: string
  fechaCierre?: string
  estado: EstadoCaja
  montoInicial: number
}

export interface CajaActiva {
  cajaId: string
  aperturaCajaId: string
}

export interface ResumenPrevioCaja {
  montoInicial: number
  efectivoVentas: number
  efectivoEsperado: number
}