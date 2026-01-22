import { useState } from 'react'

import { PedidosDestinoPage } from './Destino/PedidosDestinoPage'
import { DespachosDestinoPage } from './Destino/DespachosDestinoPage'
import { DespachosOrigenPage } from './Origen/DespachosOrigenPage'

import { useSucursalContext } from '../hooks/useSucursalContext'
import { useAuth } from '@/modules/auth/useAuth'

type Tab =
  | 'PEDIDOS'
  | 'DESPACHOS_ENTRANTES'
  | 'DESPACHOS_SALIENTES'

export function DespachoPage() {
  const { user } = useAuth()
  const { data: sucursal } = useSucursalContext()

  const [tab, setTab] = useState<Tab>('PEDIDOS')

  const esPrincipal = sucursal?.esPrincipal
  const rol = user?.rol

  return (
    <div className="space-y-4">
      {/* ===============================
          Tabs
      =============================== */}
      <div className="flex gap-2 border-b border-slate-800">
        {/* ENCARGADO / ADMIN → puede pedir */}
        {(rol === 'ENCARGADO' || rol === 'ADMIN') && (
          <button
            onClick={() => setTab('PEDIDOS')}
            className={`px-3 py-2 text-sm ${
              tab === 'PEDIDOS'
                ? 'border-b-2 border-emerald-500'
                : 'text-slate-400'
            }`}
          >
            Pedidos
          </button>
        )}

        {/* Todos → despachos entrantes */}
        <button
          onClick={() =>
            setTab('DESPACHOS_ENTRANTES')
          }
          className={`px-3 py-2 text-sm ${
            tab === 'DESPACHOS_ENTRANTES'
              ? 'border-b-2 border-emerald-500'
              : 'text-slate-400'
          }`}
        >
          Despachos entrantes
        </button>

        {/* Solo principal / admin */}
        {(esPrincipal || rol === 'ADMIN') && (
          <button
            onClick={() =>
              setTab('DESPACHOS_SALIENTES')
            }
            className={`px-3 py-2 text-sm ${
              tab === 'DESPACHOS_SALIENTES'
                ? 'border-b-2 border-emerald-500'
                : 'text-slate-400'
            }`}
          >
            Bodega / Despachos
          </button>
        )}
      </div>

      {/* ===============================
          Contenido
      =============================== */}
      {tab === 'PEDIDOS' && <PedidosDestinoPage />}

      {tab === 'DESPACHOS_ENTRANTES' && (
        <DespachosDestinoPage />
      )}

      {tab === 'DESPACHOS_SALIENTES' && (
        <DespachosOrigenPage />
      )}
    </div>
  )
}