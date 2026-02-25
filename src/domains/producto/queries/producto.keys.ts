export const productoKeys = {
  all: ['productos'] as const,

  pos: () =>
    [...productoKeys.all, 'pos'] as const,

  admin: () =>
    [...productoKeys.all, 'admin'] as const,

  search: (term: string) =>
    [...productoKeys.all, 'search', term] as const,

  codigo: (codigo: string) =>
    [...productoKeys.all, 'codigo', codigo] as const,
}