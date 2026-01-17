export interface Proveedor {
  _id: string
  nombre: string
  activo: boolean
  createdAt?: string
  updatedAt?: string
}

/* ================================
   DTOs
================================ */

export interface CreateProveedorDTO {
  nombre: string
}

export interface UpdateProveedorDTO {
  nombre?: string
  activo?: boolean
}