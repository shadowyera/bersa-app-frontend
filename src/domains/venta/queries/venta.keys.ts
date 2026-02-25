export const ventaKeys = {
  all: ['ventas'] as const,

  apertura: (cajaId?: string) =>
    [...ventaKeys.all, 'apertura', cajaId] as const,

  admin: {
    all: () =>
      [...ventaKeys.all, 'admin'] as const,

    list: (paramsKey: string) =>
      [...ventaKeys.admin.all(), 'list', paramsKey] as const,

    detalle: (ventaId?: string) =>
      [...ventaKeys.admin.all(), 'detalle', ventaId] as const,
  },
}