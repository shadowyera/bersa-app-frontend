export type RolUsuario =
  | 'ADMIN'
  | 'ENCARGADO'
  | 'CAJERO'
  | 'BODEGUERO'

export interface User {
  id: string
  nombre: string
  rol: RolUsuario

  sucursal: {
    id: string
    esPrincipal: boolean
  }

  permisos: {
    puedeVerTodasLasSucursales: boolean
    puedeGestionarUsuarios: boolean
  }
}