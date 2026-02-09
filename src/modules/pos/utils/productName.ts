const STOP_WORDS = [
  'papel',
  'higienico',
  'higiénico',
  'panales',
  'pañales',
  'adulto',
  'bebe',
  'bebé',
  'toallitas',
  'humedas',
  'húmedas',
  'de',
  'un',
  'unid',
  'unidades'
]

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/papel\s+higienico/gi, ''],
  [/papel\s+higiénico/gi, ''],

  [/toalla\s+de\s+papel/gi, 'toalla'],

  [/toallitas\s+humedas/gi, ''],
  [/toallitas\s+húmedas/gi, ''],

  [/pañales\s+adulto/gi, ''],
  [/pañales\s+bebe/gi, ''],
  [/pañales\s+bebé/gi, '']
]

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/**
 * Detecta:
 * 24 rollos -> 24r
 * 26 m      -> 26m
 * 45 un     -> 45u
 * 200ml    -> 200ml
 * 170 g    -> 170g
 */
function extractPackInfo(text: string) {
  const rollos = text.match(/(\d+)\s*rollos?/i)
  const metros = text.match(/(\d+)\s*m/i)
  const unidades = text.match(/(\d+)\s*un/i)
  const gramos = text.match(/(\d+)\s*g/i)
  const ml = text.match(/(\d+)\s*ml/i)

  return {
    rollos: rollos ? `${rollos[1]}r` : '',
    metros: metros ? `${metros[1]}m` : '',
    unidades: unidades ? `${unidades[1]}u` : '',
    gramos: gramos ? `${gramos[1]}g` : '',
    ml: ml ? `${ml[1]}ml` : ''
  }
}

function extractTalla(text: string) {
  const match = text.match(/\b(xxg|xg|g\/xg|g|m|l|s)\b/i)
  return match ? match[1].toUpperCase() : ''
}

export function buildPosProductName(
  name: string,
  maxLength = 26
) {
  let clean = normalize(name)

  PHRASE_REPLACEMENTS.forEach(([regex, value]) => {
    clean = clean.replace(regex, value)
  })

  const pack = extractPackInfo(clean)
  const talla = extractTalla(clean)

  let base = clean
    .split(' ')
    .filter(w => !STOP_WORDS.includes(w))
    .join(' ')

  base = base
    .replace(/\b(xxg|xg|g\/xg|g|m|l|s)\b/gi, '')
    .replace(/\d+\s*(rollos?|m|un|g|ml)/gi, '')
    .trim()

  let result = base

  if (talla) result += ` ${talla}`
  if (pack.unidades) result += ` ${pack.unidades}`
  if (pack.rollos) result += ` ${pack.rollos}`
  if (pack.metros) result += ` ${pack.metros}`
  if (pack.gramos) result += ` ${pack.gramos}`
  if (pack.ml) result += ` ${pack.ml}`

  result = result.replace(/\b\w/g, c => c.toUpperCase())

  if (result.length <= maxLength) return result

  return result.slice(0, maxLength - 3).trimEnd() + '...'
}