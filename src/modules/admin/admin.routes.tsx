import { Outlet, Route } from 'react-router-dom'

import AdminLayout from './AdminLayout'
import RoleRoute from '@/shared/layouts/RoleRoute'

/* ===============================
   VENTAS
=============================== */
import AdminVentasPage from './ventas/pages/AdminVentasPage'
import AdminVentaDetallePage from './ventas/pages/AdminVentaDetallePage'

/* ===============================
   APERTURAS
=============================== */
import AdminAperturasPage from './aperturas/pages/AdminAperturasPage'
import AdminAperturaDetallePage from './aperturas/pages/AdminAperturaDetallePage'

/* ===============================
   CORE
=============================== */
import CategoriasPage from './categorias/CategoriasPage'
import ProductosPage from './productos/ProductosPage'
import AdminStockPage from './stock/pages/AdminStockPage'
import ProveedoresPage from './proveedores/ProveedoresPage'
import AbastecimientoPage from './abastecimiento/AbastecimientoPage'

/* ===============================
   PEDIDOS
=============================== */
import PedidosPage from './pedido/ui/pedidos/PedidosPage'
import PrepararPedidoPage from './pedido/ui/preparar-pedido/PrepararPedidoPage'
import CrearPedidoPage from './pedido/ui/crear-pedido/CrearPedidoPage'

/* ===============================
   DESPACHOS
=============================== */
import DespachosPage from './despachos/ui/despachos/DespachosPage'
import CrearDespachoPage from './despachos/ui/crear-despacho/CrearDespachoPage'

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <RoleRoute allow={['ADMIN', 'ENCARGADO', 'BODEGUERO']}>
        <AdminLayout />
      </RoleRoute>
    }
  >
    {/* ===============================
        CORE
    =============================== */}
    <Route path="categorias" element={<CategoriasPage />} />
    <Route path="productos" element={<ProductosPage />} />
    <Route path="proveedores" element={<ProveedoresPage />} />
    <Route path="stock" element={<AdminStockPage />} />
    <Route
      path="abastecimiento"
      element={<AbastecimientoPage />}
    />

    {/* ===============================
        APERTURAS (solo admin)
    =============================== */}
    <Route
      element={
        <RoleRoute allow={['ADMIN']}>
          <Outlet />
        </RoleRoute>
      }
    >
      <Route
        path="aperturas"
        element={<AdminAperturasPage />}
      />
      <Route
        path="aperturas/:id"
        element={<AdminAperturaDetallePage />}
      />
    </Route>

    {/* ===============================
        VENTAS (admin / encargado)
    =============================== */}
    <Route
      element={
        <RoleRoute allow={['ADMIN', 'ENCARGADO']}>
          <Outlet />
        </RoleRoute>
      }
    >
      <Route
        path="ventas"
        element={<AdminVentasPage />}
      />
      <Route
        path="ventas/:ventaId"
        element={<AdminVentaDetallePage />}
      />
    </Route>

    {/* ===============================
        PEDIDOS
    =============================== */}
    <Route
      path="pedidos"
      element={<PedidosPage />}
    />
    <Route
      path="pedidos/nuevo"
      element={<CrearPedidoPage />}
    />
    <Route
      path="pedidos/:pedidoId/preparar"
      element={<PrepararPedidoPage />}
    />

    {/* ===============================
        DESPACHOS
    =============================== */}
    <Route
      path="despachos"
      element={<DespachosPage />}
    />
    <Route
      path="despachos/nuevo"
      element={<CrearDespachoPage />}
    />
  </Route>
)