export const productoKeys = {
  all: ['productos'] as const,

  pos: () =>
    [...productoKeys.all, 'pos'] as const,

  admin: (params?: unknown) =>
    [...productoKeys.all, 'admin', JSON.stringify(params ?? {})] as const,

  search: (term: string) =>
    [...productoKeys.all, 'search', term] as const,

  codigo: (codigo: string) =>
    [...productoKeys.all, 'codigo', codigo] as const,
}