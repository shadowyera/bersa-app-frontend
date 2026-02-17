import { useParams, useNavigate } from 'react-router-dom'
import { useCrearDespachoVM } from '../../hooks/useCrearDespachoVM'

/* =====================================================
   Page – Crear Despacho Interno
===================================================== */

export default function CrearDespachoPage() {
  const { pedidoId } = useParams<{ pedidoId?: string }>()
  const navigate = useNavigate()

  const vm = useCrearDespachoVM({
    pedidoId,
  })

  /* ===============================
     Estados derivados
  =============================== */

  const isPedido = vm.origen === 'PEDIDO'

  /* ===============================
     Render
  =============================== */

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* ===============================
          Header
      =============================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isPedido
              ? 'Despachar pedido'
              : 'Despacho directo'}
          </h1>

          <p className="text-sm text-slate-400">
            {isPedido
              ? 'Confirmación de salida desde pedido preparado'
              : 'Salida directa de productos desde bodega'}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Volver
        </button>
      </div>

      {/* ===============================
          Pedido preparado (solo lectura)
      =============================== */}
      {isPedido && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="px-4 py-3 border-b border-slate-800">
            <h2 className="font-medium">
              Ítems preparados
            </h2>
          </div>

          {vm.pedidoLoading && (
            <div className="p-4 text-sm text-slate-400">
              Cargando pedido…
            </div>
          )}

          {vm.pedidoError && (
            <div className="p-4 text-sm text-red-400">
              Error al cargar pedido
            </div>
          )}

          {!vm.pedidoLoading &&
            vm.pedido &&
            vm.pedido.items.filter(
              i => (i.cantidadPreparada ?? 0) > 0
            ).length === 0 && (
              <div className="p-4 text-sm text-slate-400">
                El pedido no tiene ítems preparados
              </div>
            )}

          {!vm.pedidoLoading &&
            vm.pedido &&
            vm.pedido.items
              .filter(
                i => (i.cantidadPreparada ?? 0) > 0
              )
              .map(item => (
                <div
                  key={item.productoId}
                  className="flex justify-between px-4 py-2 border-b border-slate-800 last:border-b-0"
                >
                  <div>
                    <p className="text-sm">
                      {item.productoNombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      Preparado
                    </p>
                  </div>

                  <div className="text-sm font-medium">
                    {item.cantidadPreparada}
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* ===============================
          Ítems suplentes / directos
      =============================== */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <h2 className="font-medium">
            {isPedido
              ? 'Ítems suplentes'
              : 'Ítems a despachar'}
          </h2>

          <button
            onClick={() =>
              vm.agregarItemSuplente({
                productoId: crypto.randomUUID(),
                productoNombre:
                  'Producto de ejemplo',
                cantidad: 1,
              })
            }
            className="text-xs px-3 py-1 rounded bg-slate-800 hover:bg-slate-700"
          >
            + Agregar
          </button>
        </div>

        {(isPedido
          ? vm.itemsSuplentes
          : vm.itemsDirectos
        ).length === 0 && (
          <div className="p-4 text-sm text-slate-400">
            No hay productos agregados
          </div>
        )}

        {(isPedido
          ? vm.itemsSuplentes
          : vm.itemsDirectos
        ).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2 border-b border-slate-800 last:border-b-0"
          >
            <div>
              <p className="text-sm">
                {item.productoNombre}
              </p>
              <p className="text-xs text-slate-400">
                Cantidad
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm">
                {item.cantidad}
              </span>

              <button
                onClick={() =>
                  vm.eliminarItem(
                    index,
                    isPedido
                      ? 'SUPLENTE'
                      : 'DIRECTO'
                  )
                }
                className="text-xs text-red-400 hover:text-red-300"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===============================
          Footer acciones
      =============================== */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-slate-400">
          Total ítems:{' '}
          <span className="font-medium text-white">
            {vm.totalItems}
          </span>
        </div>

        <button
          disabled={
            vm.isLoading ||
            (isPedido &&
              !vm.pedidoPreparadoValido)
          }
          onClick={vm.confirmarDespacho}
          className="px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          Confirmar despacho
        </button>
      </div>
    </div>
  )
}