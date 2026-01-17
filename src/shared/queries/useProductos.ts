import { useQuery } from '@tanstack/react-query'
import {
  getProductosPOS,
  getProductosAdmin,
} from '../api/producto.api'
import type { Producto } from '@/shared/types/producto.types'

/**
 * Productos visibles en POS (solo activos)
 */
export function useProductosPOS() {
  return useQuery<Producto[]>({
    queryKey: ['productos', 'pos'],
    queryFn: getProductosPOS,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

/**
 * Productos para Admin / Encargado (incluye inactivos)
 */
export function useProductosAdmin() {
  return useQuery<Producto[]>({
    queryKey: ['productos', 'admin'],
    queryFn: getProductosAdmin,
    staleTime: 2 * 60 * 1000, // menos cache
  })
}