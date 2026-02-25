export const cajaKeys = {
  all: ['caja'] as const,

  lists: () =>
    [...cajaKeys.all, 'list'] as const,

  resumenPrevio: (cajaId?: string) =>
    [...cajaKeys.all, 'resumen-previo', cajaId] as const,

  aperturasActivas: (sucursalId?: string) =>
    [...cajaKeys.all, 'aperturas-activas', sucursalId] as const,
}