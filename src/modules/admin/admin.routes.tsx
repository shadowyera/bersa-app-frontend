import { Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import RoleRoute from "@/shared/layouts/RoleRoute";

import CategoriasPage from "./categorias/CategoriasPage";
import ProductosPage from "./productos/ProductosPage";
import StockPage from "./stock/StockPage";
import ProveedoresPage from "./proveedores/ProveedoresPage";
import AbastecimientoPage from "./abastecimiento/AbastecimientoPage";

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <RoleRoute allow={["ADMIN", "ENCARGADO", "BODEGUERO"]}>
        <AdminLayout />
      </RoleRoute>
    }
  >
    <Route path="categorias" element={<CategoriasPage />} />
    <Route path="productos" element={<ProductosPage />} />
    <Route path="proveedores" element={<ProveedoresPage />} />
    <Route path="stock" element={<StockPage />} />
    <Route path="abastecimiento" element={<AbastecimientoPage />} />
  </Route>
);