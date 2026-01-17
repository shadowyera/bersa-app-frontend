export type RealtimeEventType =
  | 'CAJA_ABIERTA'
  | 'CAJA_CERRADA'

export interface RealtimeEvent {
  type: RealtimeEventType
  sucursalId: string
  cajaId: string
  aperturaCajaId?: string

  // 🔥 CLAVE para distinguir local vs remoto
  origenUsuarioId: string
}