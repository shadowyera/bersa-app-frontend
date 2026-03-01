import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createProducto,
  updateProducto,
  setProductoActivo,
} from '@/domains/producto/api/producto.api'

import type {
  CreateProductoDTO,
  UpdateProductoDTO,
} from '@/domains/producto/api/producto.contracts'

import { productoKeys } from '../queries/producto.keys'

export function useProductoMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: productoKeys.all,
      exact: false,
    })
  }

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductoDTO) =>
      createProducto(payload),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateProductoDTO
    }) => updateProducto(id, payload),
    onSuccess: invalidate,
  })

  const toggleMutation = useMutation({
    mutationFn: ({
      id,
      activo,
    }: {
      id: string
      activo: boolean
    }) => setProductoActivo(id, activo),
    onSuccess: invalidate,
  })

  return {
    createProducto: createMutation.mutateAsync,
    updateProducto: updateMutation.mutateAsync,
    toggleActivo: (id: string, activo: boolean) =>
      toggleMutation.mutateAsync({ id, activo }),

    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    toggling: toggleMutation.isPending,
  }
}