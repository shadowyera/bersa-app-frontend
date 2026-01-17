import { useEffect, useRef, useState } from 'react'
import { useProductosPicker, type ProductoPickerItem } from './useProductosPicker'
import { useAuth } from '@/modules/auth/useAuth'

interface Props {
  onSelect: (p: ProductoPickerItem) => void
}

function resaltar(texto: string, query: string) {
  if (!query) return texto

  const regex = new RegExp(`(${query})`, 'ig')
  const parts = texto.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-emerald-400 font-semibold">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

export default function ProductoPicker({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { user } = useAuth()
  if (!user) return null

  const { productos, loading } = useProductosPicker(user.sucursalId)

  const [query, setQuery] = useState('')
  const [show, setShow] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const q = query.toLowerCase()

  const filtrados = productos.filter(
    p =>
      p.nombre.toLowerCase().includes(q) ||
      p.codigo?.toLowerCase().includes(q)
  )

  return (
    <div className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          setShow(true)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            const exacto = productos.find(
              p => p.codigo?.toLowerCase() === q
            )

            if (exacto) {
              onSelect(exacto)
              setQuery('')
              setShow(false)
            }
          }
        }}
        placeholder="Escanear o buscar producto"
        className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2"
      />

      {show && query && (
        <div className="absolute z-30 w-full bg-slate-900 border border-slate-700 rounded mt-1 max-h-60 overflow-auto">
          {loading && (
            <div className="px-3 py-2 text-sm text-slate-400">
              Buscando productos…
            </div>
          )}

          {!loading &&
            filtrados.slice(0, 20).map(p => (
              <div
                key={p._id}
                onClick={() => {
                  onSelect(p)
                  setQuery('')
                  setShow(false)
                }}
                className="px-3 py-2 hover:bg-slate-700 cursor-pointer rounded"
              >
                {/* Nombre */}
                <div className="font-medium text-slate-200 leading-tight">
                  {resaltar(p.nombre, query)}
                </div>

                {/* Meta info */}
                <div className="flex justify-between items-center mt-1 text-xs">
                  {/* Código */}
                  <span className="text-slate-400">
                    {p.codigo
                      ? resaltar(p.codigo, query)
                      : '—'}
                  </span>

                  {/* Stock */}
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      p.stock > 5
                        ? 'text-emerald-400'
                        : p.stock > 0
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    Stock: {p.stock} un
                    {p.stock <= 5 && (
                      <span
                        title="Stock bajo"
                        className="text-amber-400"
                      >
                        ⚠
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}

          {!loading && filtrados.length === 0 && (
            <div className="px-3 py-2 text-sm text-slate-400">
              Sin resultados
            </div>
          )}
        </div>
      )}
    </div>
  )
}