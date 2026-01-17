import { NavLink } from "react-router-dom";
import { memo } from "react";
import { useAuth } from "../../modules/auth/useAuth";

/**
 * ⚡ CLASE BASE ULTRA OPTIMIZADA
 */
const linkBase =
  "flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm select-none " +
  "transition-colors duration-75 ease-linear " +
  "will-change-[background-color,color]";

const active = "bg-emerald-600/20 text-emerald-400";
const inactive = "text-slate-300 hover:bg-slate-800 hover:text-slate-100";

export default memo(function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = ["ADMIN", "ENCARGADO", "BODEGUERO"].includes(user.rol);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Brand */}
      <div className="h-14 px-4 flex items-center border-b border-slate-800 text-slate-200 font-semibold">
        Bersa <span className="text-emerald-400 ml-1">POS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
        {/* POS */}
        <NavLink
          to="/pos"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          🧾 POS
        </NavLink>

        {/* OPERACIÓN */}
        <Section title="Operación" />

        <Item to="/admin/ventas">💳 Ventas</Item>
        <Item to="/admin/stock">🏬 Stock</Item>

        {isAdmin && (
          <Item to="/admin/abastecimiento">📥 Abastecimiento</Item>
        )}

        <Item to="/admin/movimientos">🔄 Movimientos</Item>

        {/* CATÁLOGO */}
        <Section title="Catálogo" />

        <Item to="/admin/productos">📦 Productos</Item>
        <Item to="/admin/categorias">🗂 Categorías</Item>
        <Item to="/admin/proveedores">🚚 Proveedores</Item>

        {/* CAJA */}
        <Section title="Caja" />

        <Item to="/admin/cajas">💰 Cajas</Item>
        <Item to="/admin/cierres">📊 Cierres</Item>

        {/* ANÁLISIS */}
        <Section title="Análisis" />

        <Item to="/admin/reportes">📈 Reportes</Item>

        {/* SISTEMA */}
        {isAdmin && (
          <>
            <Section title="Sistema" />
            <Item to="/admin/usuarios">👤 Usuarios</Item>
            <Item to="/admin/sucursales">🏪 Sucursales</Item>
            <Item to="/admin/configuracion">⚙️ Configuración</Item>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-3 text-xs text-slate-400">
        <div className="text-slate-200">{user.nombre}</div>
        <div>{user.rol}</div>
      </div>
    </aside>
  );
});

/* Helpers */

function Item({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? active : inactive}`
      }
    >
      {children}
    </NavLink>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div className="mt-4 text-xs text-slate-500 px-3 uppercase tracking-wide">
      {title}
    </div>
  );
}