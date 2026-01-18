import { memo, useCallback, useDeferredValue, useEffect, useState } from 'react'

interface Props {
  onChangeQuery: (q: string) => void
}

function ProductSearch({ onChangeQuery }: Props) {
  const [query, setQuery] = useState('')

  // Valor deferido para no disparar renders agresivos
  const deferredQuery = useDeferredValue(query)

  // Propagar búsqueda solo cuando el valor deferido cambia
  useEffect(() => {
    onChangeQuery(deferredQuery)
  }, [deferredQuery, onChangeQuery])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    []
  )

  return (
    <input
      value={query}
      onChange={handleChange}
      placeholder="Buscar producto por nombre o código"
      className="w-full bg-slate-800 p-3 rounded outline-none focus:ring-2 focus:ring-emerald-500"
    />
  )
}

export default memo(ProductSearch)