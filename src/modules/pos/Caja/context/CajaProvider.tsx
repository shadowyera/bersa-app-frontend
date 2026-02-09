import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
} from 'react'
import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'

/* =====================================================
   Domain
===================================================== */
import type { Caja, AperturaCaja } from '../domain/caja.types'
import { initialCajaState } from '../domain/caja.state'
import { cajaReducer } from '../domain/caja.reducer'

/* =====================================================
   API
===================================================== */
import {
  getAperturaActiva,
  abrirCaja as apiAbrirCaja,
  getResumenPrevioCaja,
  cerrarCajaAutomatico,
  getAperturasActivasSucursal,
} from '../api/caja.api'

/* =====================================================
   Auth
===================================================== */
import { useAuth } from '@/modules/auth/useAuth'

/* =====================================================
   Tipos UI
===================================================== */
export interface ResumenPrevioCaja {
  cajaId: string
  aperturaId: string
  montoInicial: number
  totalVentas: number
  efectivoVentas: number
  efectivoEsperado: number
}

interface CajaPersistida {
  id: string
  nombre: string
}

/* =====================================================
   Context
===================================================== */
interface CajaContextValue {
  cajaSeleccionada: Caja | null
  aperturaActiva: AperturaCaja | null

  validandoCaja: boolean
  cargando: boolean
  closingCaja: boolean
  error?: string

  seleccionarCaja: (caja: Caja) => Promise<void>
  deseleccionarCaja: () => void
  abrirCaja: (montoInicial: number) => Promise<void>

  iniciarCierre: () => Promise<void>
  confirmarCierre: () => Promise<void>
  cancelarCierre: () => void

  showCierreModal: boolean
  resumenPrevio: ResumenPrevioCaja | null
  montoFinal: string
  setMontoFinal: (v: string) => void
}

const CajaContext = createContext<CajaContextValue | null>(null)

const CAJA_STORAGE_KEY = 'bersa:cajaSeleccionada'

/* =====================================================
   Helpers
===================================================== */
function persistCaja(caja: Caja) {
  localStorage.setItem(
    CAJA_STORAGE_KEY,
    JSON.stringify({ id: caja.id, nombre: caja.nombre })
  )
}

function clearCajaPersistida() {
  localStorage.removeItem(CAJA_STORAGE_KEY)
}

function getCajaPersistida(): CajaPersistida | null {
  try {
    const raw = localStorage.getItem(CAJA_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/* =====================================================
   Provider
===================================================== */
export function CajaProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const sucursalId = user?.sucursalId

  const [state, dispatch] = useReducer(
    cajaReducer,
    initialCajaState
  )

  /* -------------------- Estado proceso -------------------- */
  const [validandoCaja, setValidandoCaja] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [closingCaja, setClosingCaja] = useState(false)
  const [error, setError] = useState<string | undefined>()

  /* -------------------- Estado UI cierre -------------------- */
  const [showCierreModal, setShowCierreModal] = useState(false)
  const [resumenPrevio, setResumenPrevio] =
    useState<ResumenPrevioCaja | null>(null)
  const [montoFinal, setMontoFinal] = useState('')

  /* =====================================================
     Snapshot global (React Query + SSE)
  ===================================================== */
  const { data: aperturasActivas } = useQuery({
    queryKey: ['aperturas-activas', sucursalId],
    queryFn: () =>
      getAperturasActivasSucursal(sucursalId!),
    enabled: Boolean(sucursalId),
  })

  /* =====================================================
     Sync React Query → Context
  ===================================================== */
  useEffect(() => {
    if (!state.cajaSeleccionada || !aperturasActivas) return

    const cajaId = state.cajaSeleccionada.id

    const apertura =
      aperturasActivas.find(a => a.cajaId === cajaId) ??
      null

    dispatch({
      type: 'SET_APERTURA_ACTIVA',
      apertura,
    })
  }, [aperturasActivas, state.cajaSeleccionada?.id])

  /* =====================================================
     Restore sesión
  ===================================================== */
  useEffect(() => {
    if (!user) return

    const persisted = getCajaPersistida()
    if (!persisted) return

    setValidandoCaja(true)

    getAperturaActiva(persisted.id)
      .then(apertura => {
        dispatch({
          type: 'SELECCIONAR_CAJA',
          caja: {
            id: persisted.id,
            nombre: persisted.nombre,
            sucursalId: user.sucursalId,
            activa: true,
          },
        })

        dispatch({
          type: 'SET_APERTURA_ACTIVA',
          apertura,
        })
      })
      .catch(clearCajaPersistida)
      .finally(() => setValidandoCaja(false))
  }, [user])

  /* =====================================================
     Helpers UI
  ===================================================== */
  const resetCierreUI = useCallback(() => {
    setShowCierreModal(false)
    setResumenPrevio(null)
    setMontoFinal('')
  }, [])

  /* =====================================================
     Acciones públicas
  ===================================================== */
  const seleccionarCaja = useCallback(
    async (caja: Caja) => {
      setValidandoCaja(true)
      setError(undefined)

      try {
        const apertura = await getAperturaActiva(caja.id)

        resetCierreUI()

        dispatch({ type: 'SELECCIONAR_CAJA', caja })
        dispatch({
          type: 'SET_APERTURA_ACTIVA',
          apertura,
        })

        persistCaja(caja)
      } catch {
        setError('No se pudo seleccionar la caja')
      } finally {
        setValidandoCaja(false)
      }
    },
    [resetCierreUI]
  )

  const deseleccionarCaja = useCallback(() => {
    clearCajaPersistida()
    dispatch({ type: 'RESET' })
    resetCierreUI()
  }, [resetCierreUI])

  const abrirCaja = useCallback(
    async (montoInicial: number) => {
      if (!state.cajaSeleccionada) return

      setCargando(true)
      setError(undefined)

      try {
        const apertura = await apiAbrirCaja({
          cajaId: state.cajaSeleccionada.id,
          montoInicial,
        })

        dispatch({
          type: 'APERTURA_CAJA',
          apertura,
        })
      } catch {
        setError('No se pudo abrir la caja')
      } finally {
        setCargando(false)
      }
    },
    [state.cajaSeleccionada]
  )

  const iniciarCierre = useCallback(async () => {
    if (!state.cajaSeleccionada) return

    setCargando(true)
    setError(undefined)

    try {
      const resumen = await getResumenPrevioCaja(
        state.cajaSeleccionada.id
      )

      setResumenPrevio(resumen)
      setMontoFinal(String(resumen.efectivoEsperado))
      setShowCierreModal(true)
    } catch {
      setError('No se pudo obtener el resumen')
    } finally {
      setCargando(false)
    }
  }, [state.cajaSeleccionada])

  const confirmarCierre = useCallback(async () => {
    if (!state.cajaSeleccionada) return

    setClosingCaja(true)
    setError(undefined)

    try {
      await cerrarCajaAutomatico({
        cajaId: state.cajaSeleccionada.id,
        montoFinal: Number(montoFinal),
      })

      dispatch({ type: 'CIERRE_CAJA' })
      clearCajaPersistida()
      resetCierreUI()
    } catch {
      setError('No se pudo cerrar la caja')
    } finally {
      setClosingCaja(false)
    }
  }, [state.cajaSeleccionada, montoFinal, resetCierreUI])

  const cancelarCierre = useCallback(() => {
    resetCierreUI()
  }, [resetCierreUI])

  return (
    <CajaContext.Provider
      value={{
        cajaSeleccionada: state.cajaSeleccionada,
        aperturaActiva: state.aperturaActiva,

        validandoCaja,
        cargando,
        closingCaja,
        error,

        seleccionarCaja,
        deseleccionarCaja,
        abrirCaja,

        iniciarCierre,
        confirmarCierre,
        cancelarCierre,

        showCierreModal,
        resumenPrevio,
        montoFinal,
        setMontoFinal,
      }}
    >
      {children}
    </CajaContext.Provider>
  )
}

/* =====================================================
   Hook público
===================================================== */
export function useCaja() {
  const ctx = useContext(CajaContext)
  if (!ctx) {
    throw new Error(
      'useCaja debe usarse dentro de <CajaProvider>'
    )
  }
  return ctx
}