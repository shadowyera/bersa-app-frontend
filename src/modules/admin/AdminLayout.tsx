import { Outlet, useMatch } from 'react-router-dom'
import { PedidosProvider } from './pedido/context/PedidosProvider'

export default function AdminLayout() {
  const isPedidosRoute = useMatch('/admin/pedidos/*')

  if (isPedidosRoute) {
    return (
      <PedidosProvider>
        <Outlet />
      </PedidosProvider>
    )
  }

  return <Outlet />
}