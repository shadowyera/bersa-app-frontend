import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * IMPORTANTE:
   * - preventDefault + stopPropagation
   * - NO refresh de página
   * - errores visibles en consola
   */
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('[LOGIN] submit', { email })

    try {
      setLoading(true)
      setError(null)

      const user = await login(email, password)

      console.log('[LOGIN OK]', user)

      // 🔥 redirección por rol
      if (user.rol === 'ADMIN' || user.rol === 'ENCARGADO') {
        navigate('/admin/productos', { replace: true })
      } else if (user.rol === 'BODEGUERO') {
        navigate('/admin/stock', { replace: true })
      } else {
        navigate('/pos', { replace: true })
      }
    } catch (err: any) {
      console.error('[LOGIN ERROR]', err)
      setError(
        err?.response?.data?.message ??
          'Error al iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md bg-slate-800 p-8 rounded-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-white">
          POS Bersa
        </h1>

        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full p-3 rounded bg-slate-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full p-3 rounded bg-slate-700 text-white"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold"
        >
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}