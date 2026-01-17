import { useState } from 'react'

interface Props {
  onChangeQuery: (q: string) => void
}

export default function ProductSearch({ onChangeQuery }: Props) {
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value)
        onChangeQuery(e.target.value)
      }}
      placeholder="Buscar producto por nombre o código"
      className="w-full bg-slate-800 p-3 rounded outline-none focus:ring-2 focus:ring-emerald-500"
    />
  )
}