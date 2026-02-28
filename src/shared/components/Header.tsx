import { APP_CONFIG } from '@/config/app.config'
import HeaderUserMenu from './HeaderUserMenu'

/**
 * Header global de la aplicación
 *
 * - Vive fuera del POS
 * - No contiene lógica de negocio
 * - Solo layout + composición
 */
export default function Header() {
  return (
    <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center px-4">
      {/* Branding */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-slate-100">
          {APP_CONFIG.appName}
        </span>
        <span className="text-xs text-slate-400">
          App
        </span>
      </div>

      {/* Usuario */}
      <div className="ml-auto">
        <HeaderUserMenu />
      </div>
    </header>
  )
}