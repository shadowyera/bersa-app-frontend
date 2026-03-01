import { Outlet, useMatch } from 'react-router-dom'
import { PedidosProvider } from './pedido/context/PedidosProvider'

export default function AdminLayout() {

  const isPedidosRoute = useMatch('/admin/pedidos/*')

  const content = isPedidosRoute ? (
    <PedidosProvider>
      <Outlet />
    </PedidosProvider>
  ) : (
    <Outlet />
  )

  return (
    <div className="min-h-full bg-background text-foreground">
      <div className="h-full">
        {content}
      </div>
    </div>
  )
}