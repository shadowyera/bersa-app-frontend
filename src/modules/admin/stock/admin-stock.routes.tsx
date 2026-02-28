import { Route } from 'react-router-dom'
import AdminStockPage from './pages/AdminStockPage'

export const stockAdminRoutes = (
  <>
    <Route
      path="/admin/stock"
      element={<AdminStockPage />}
    />
  </>
)