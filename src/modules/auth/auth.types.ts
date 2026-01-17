export type RolUsuario =
  | 'ADMIN'
  | 'ENCARGADO'
  | 'CAJERO'
  | 'BODEGUERO'

export interface User {
  _id: string
  nombre: string
  rol: RolUsuario
  sucursalId: string
}