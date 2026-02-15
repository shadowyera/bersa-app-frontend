export function limpiarRut(value: string) {
  return value
    .replace(/\./g, '')
    .replace(/[^0-9kK-]/g, '')
    .toUpperCase()
}

export function validarRut(rut: string): boolean {
  const clean = rut.replace(/\./g, '').toUpperCase()

  if (!clean.includes('-')) return false

  const [body, dv] = clean.split('-')

  if (!body || !dv) return false
  if (!/^\d+$/.test(body)) return false

  let suma = 0
  let multiplo = 2

  for (let i = body.length - 1; i >= 0; i--) {
    suma += Number(body[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }

  const resto = 11 - (suma % 11)
  const dvEsperado =
    resto === 11
      ? '0'
      : resto === 10
      ? 'K'
      : String(resto)

  return dvEsperado === dv
}