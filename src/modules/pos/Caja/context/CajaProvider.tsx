import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import type { ReactNode } from 'react'

/* =====================================================
   Domain
===================================================== */
import type { Caja, AperturaCaja } from '../domain/caja.types'
import {
  getAperturaActiva,
  abrirCaja as apiAbrirCaja,
  getResumenPrevioCaja,
  cerrarCajaAutomatico,
} from '../domain/caja.api'

/* =====================================================
   Realtime (SSE)
===================================================== */
import {
  connectCajaRealtime,
  registerCajaRealtimeHandler,
} from '../caja.realtime'
import type { RealtimeEvent } from '@/shared/realtime/realtime.events'

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
   Provider
===================================================== */
export function CajaProvider({ children }: { children: ReactNode }) {
  /* -------------------- Estado base -------------------- */
  const [cajaSeleccionada, setCajaSeleccionada] =
    useState<Caja | null>(null)
  const [aperturaActiva, setAperturaActiva] =
    useState<AperturaCaja | null>(null)

  /* -------------------- Flags -------------------- */
  const [validandoCaja, setValidandoCaja] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [closingCaja, setClosingCaja] = useState(false)
  const [error, setError] = useState<string>()

  /* -------------------- UI cierre -------------------- */
  const [showCierreModal, setShowCierreModal] =
    useState(false)
  const [resumenPrevio, setResumenPrevio] =
    useState<ResumenPrevioCaja | null>(null)
  const [montoFinal, setMontoFinal] = useState('')

  /* -------------------- Ref para SSE -------------------- */
  const cajaRef = useRef<Caja | null>(null)

  useEffect(() => {
    cajaRef.current = cajaSeleccionada
  }, [cajaSeleccionada])

  /* =====================================================
     Helpers
  ===================================================== */
  const persistCaja = (caja: Caja) => {
    localStorage.setItem(
      CAJA_STORAGE_KEY,
      JSON.stringify({ id: caja.id, nombre: caja.nombre })
    )
  }

  const resetCajaLocal = useCallback(() => {
    localStorage.removeItem(CAJA_STORAGE_KEY)

    setCajaSeleccionada(null)
    setAperturaActiva(null)

    setShowCierreModal(false)
    setResumenPrevio(null)
    setMontoFinal('')

    setError(undefined)
    setCargando(false)
    setClosingCaja(false)
    setValidandoCaja(false)
  }, [])

  /* =====================================================
     SSE
  ===================================================== */
  useEffect(() => {
    registerCajaRealtimeHandler((event: RealtimeEvent) => {
      const caja = cajaRef.current
      if (!caja) return

      if (
        event.type === 'CAJA_CERRADA' &&
        event.cajaId === caja.id
      ) {
        resetCajaLocal()
      }
    })

    connectCajaRealtime()
  }, [resetCajaLocal])

  /* =====================================================
     RESTORE DESDE LOCALSTORAGE
  ===================================================== */
  useEffect(() => {
    const restore = async () => {
      const raw = localStorage.getItem(CAJA_STORAGE_KEY)
      if (!raw) return

      const persisted: CajaPersistida = JSON.parse(raw)

      setValidandoCaja(true)

      try {
        const apertura = await getAperturaActiva(persisted.id)
        if (!apertura) {
          resetCajaLocal()
          return
        }

        setCajaSeleccionada({
          id: persisted.id,
          nombre: persisted.nombre,
          sucursalId: apertura.sucursalId,
          activa: true,
        })
        setAperturaActiva(apertura)
      } catch {
        resetCajaLocal()
      } finally {
        setValidandoCaja(false)
      }
    }

    restore()
  }, [resetCajaLocal])

  /* =====================================================
     Acciones
  ===================================================== */
  const seleccionarCaja = useCallback(async (caja: Caja) => {
    setValidandoCaja(true)
    setError(undefined)

    try {
      const apertura = await getAperturaActiva(caja.id)

      setCajaSeleccionada(caja)
      setAperturaActiva(apertura)
      persistCaja(caja)
    } catch {
      resetCajaLocal()
      setError('No se pudo seleccionar la caja')
    } finally {
      setValidandoCaja(false)
    }
  }, [resetCajaLocal])

  const deseleccionarCaja = useCallback(() => {
    resetCajaLocal()
  }, [resetCajaLocal])

  const abrirCaja = useCallback(
    async (montoInicial: number) => {
      if (!cajaSeleccionada) return

      setCargando(true)
      setError(undefined)

      try {
        const apertura = await apiAbrirCaja({
          cajaId: cajaSeleccionada.id,
          montoInicial,
        })
        setAperturaActiva(apertura)
      } catch {
        setError('No se pudo abrir la caja')
      } finally {
        setCargando(false)
      }
    },
    [cajaSeleccionada]
  )

  const iniciarCierre = useCallback(async () => {
    if (!cajaSeleccionada) return

    setCargando(true)
    setError(undefined)

    try {
      const resumen = await getResumenPrevioCaja(
        cajaSeleccionada.id
      )
      setResumenPrevio(resumen)
      setMontoFinal(String(resumen.efectivoEsperado))
      setShowCierreModal(true)
    } catch {
      setError('No se pudo obtener el resumen')
    } finally {
      setCargando(false)
    }
  }, [cajaSeleccionada])

  const confirmarCierre = useCallback(async () => {
    if (!cajaSeleccionada) return

    setClosingCaja(true)
    setError(undefined)

    try {
      await cerrarCajaAutomatico({
        cajaId: cajaSeleccionada.id,
        montoFinal: Number(montoFinal),
      })
      resetCajaLocal()
    } catch {
      setError('No se pudo cerrar la caja')
    } finally {
      setClosingCaja(false)
    }
  }, [cajaSeleccionada, montoFinal, resetCajaLocal])

  const cancelarCierre = useCallback(() => {
    setShowCierreModal(false)
    setResumenPrevio(null)
    setMontoFinal('')
  }, [])

  /* =====================================================
     Context value
  ===================================================== */
  const value = useMemo<CajaContextValue>(
    () => ({
      cajaSeleccionada,
      aperturaActiva,

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
    }),
    [
      cajaSeleccionada,
      aperturaActiva,
      validandoCaja,
      cargando,
      closingCaja,
      error,
      showCierreModal,
      resumenPrevio,
      montoFinal,
    ]
  )

  return (
    <CajaContext.Provider value={value}>
      {children}
    </CajaContext.Provider>
  )
}

/* =====================================================
   Hook
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