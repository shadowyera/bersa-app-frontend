export const stockKeys = {
  all: ['stock'] as const,

  lists: () =>
    [...stockKeys.all, 'list'] as const,

  sucursal: (sucursalId: string) =>
    [...stockKeys.lists(), 'sucursal', sucursalId] as const,
}