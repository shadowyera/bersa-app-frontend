import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../modules/auth/useAuth'

/* =====================================================
   Estilos base
===================================================== */

const linkBase =
  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm select-none ' +
  'transition-colors duration-100 ease-out'

const active =
  'bg-primary/15 text-primary'

const inactive =
  'text-foreground/70 hover:bg-surface hover:text-foreground'

/* =====================================================
   Sidebar
===================================================== */

export default memo(function Sidebar() {

  const { user } = useAuth()
  if (!user) return null

  const rol = user.rol

  const isAdmin =
    rol === 'ADMIN' ||
    rol === 'ENCARGADO'

  const isOperacion =
    isAdmin || rol === 'BODEGUERO'

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col">

      {/* =============================================
          Brand
      ============================================= */}
      <div className="h-14 px-4 flex items-center border-b border-border font-semibold">
        <span className="text-foreground">
          Bersa
        </span>
        <span className="text-primary ml-1">
          POS
        </span>
      </div>

      {/* =============================================
          Navigation
      ============================================= */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">

        <Item to="/pos">🧾 POS</Item>

        <Section title="Operación" />

        <Item to="/admin/pedidos">
          📄 Pedidos
        </Item>

        <Item to="/admin/stock">
          🏬 Stock
        </Item>

        {isOperacion && (
          <>
            <Item to="/admin/abastecimiento">
              📥 Abastecimiento
            </Item>

            <Item to="/admin/despachos">
              🚚 Despachos
            </Item>
          </>
        )}

        <Item to="/admin/movimientos">
          🔄 Movimientos
        </Item>

        <Section title="Caja" />

        <Item to="/admin/aperturas">
          🧾 Aperturas
        </Item>

        <Item to="/admin/ventas">
          💳 Ventas
        </Item>

        <Item to="/admin/cierres">
          📊 Cierres
        </Item>

        <Section title="Catálogo" />

        <Item to="/admin/productos">
          📦 Productos
        </Item>

        <Item to="/admin/categorias">
          🗂 Categorías
        </Item>

        <Item to="/admin/proveedores">
          🚚 Proveedores
        </Item>

        <Section title="Análisis" />

        <Item to="/admin/reportes">
          📈 Reportes
        </Item>

        {isAdmin && (
          <>
            <Section title="Sistema" />

            <Item to="/admin/usuarios">
              👤 Usuarios
            </Item>

            <Item to="/admin/sucursales">
              🏪 Sucursales
            </Item>

            <Item to="/admin/configuracion">
              ⚙️ Configuración
            </Item>
          </>
        )}

      </nav>

      {/* =============================================
          Footer
      ============================================= */}
      <div className="border-t border-border p-3 text-xs text-foreground/60">
        <div className="text-foreground">
          {user.nombre}
        </div>
        <div>{user.rol}</div>
      </div>

    </aside>
  )
})

/* =====================================================
   Helpers
===================================================== */

function Item({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? active : inactive}`
      }
    >
      {children}
    </NavLink>
  )
}

function Section({
  title,
}: {
  title: string
}) {
  return (
    <div className="mt-4 px-3 text-xs text-foreground/40 uppercase tracking-wide">
      {title}
    </div>
  )
}