export type TipoOperacionAbastecimiento =
  | 'RECEPCION'
  | 'TRANSFERENCIA'

export interface ProductoLineaAbastecimiento {
  productoId: string
  nombre: string
  cantidad: number
  unidadesPorPack?: number
}
