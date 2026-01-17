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
   Tipos UI internos
===================================================== */
export interface ResumenPrevioCaja {
  cajaId: string
  aperturaId: string
  montoInicial: number
  totalVentas: number
  efectivoVentas: number
  efectivoEsperado: number
}

/* =====================================================
   Context
===================================================== */
interface CajaContextValue {
  /* Estado base */
  cajaSeleccionada: Caja | null
  aperturaActiva: AperturaCaja | null

  /* Flags */
  validandoCaja: boolean
  cargando: boolean
  closingCaja: boolean
  error?: string

  /* Acciones principales */
  seleccionarCaja: (caja: Caja) => Promise<void>
  abrirCaja: (montoInicial: number) => Promise<void>

  /* Cierre */
  iniciarCierre: () => Promise<void>
  confirmarCierre: () => Promise<void>
  cancelarCierre: () => void

  /* UI cierre */
  showCierreModal: boolean
  resumenPrevio: ResumenPrevioCaja | null
  montoFinal: string
  setMontoFinal: (v: string) => void
}

const CajaContext = createContext<CajaContextValue | null>(null)

/* =====================================================
   Provider
===================================================== */
interface CajaProviderProps {
  children: ReactNode
}

/**
 * CajaProvider 2026
 *
 * RESPONSABILIDAD:
 * - Mantener estado LOCAL de la caja seleccionada
 * - Abrir / cerrar caja
 * - Reaccionar a eventos remotos (SSE)
 *
 * NO HACE:
 * - No decide UX
 * - No navega
 * - No renderiza UI
 */
export function CajaProvider({ children }: CajaProviderProps) {
  /* =====================================================
     Estado base
  ===================================================== */
  const [cajaSeleccionada, setCajaSeleccionada] =
    useState<Caja | null>(null)

  const [aperturaActiva, setAperturaActiva] =
    useState<AperturaCaja | null>(null)

  /* =====================================================
     Flags
  ===================================================== */
  const [validandoCaja, setValidandoCaja] =
    useState(false)

  const [cargando, setCargando] =
    useState(false)

  const [closingCaja, setClosingCaja] =
    useState(false)

  const [error, setError] = useState<string>()

  /* =====================================================
     Estado UI cierre
  ===================================================== */
  const [showCierreModal, setShowCierreModal] =
    useState(false)

  const [resumenPrevio, setResumenPrevio] =
    useState<ResumenPrevioCaja | null>(null)

  const [montoFinal, setMontoFinal] =
    useState('')

  /* =====================================================
     🔑 REFS PARA SSE
     Permiten que el handler vea el estado actual
     sin volver a registrarse
  ===================================================== */
  const cajaSeleccionadaRef =
    useRef<Caja | null>(null)

  /* Mantener ref sincronizada con React state */
  useEffect(() => {
    cajaSeleccionadaRef.current =
      cajaSeleccionada
  }, [cajaSeleccionada])

  /* =====================================================
     SSE – eventos remotos de caja
     ✔ conexión única
     ✔ handler único
     ✔ sin duplicados
  ===================================================== */
  useEffect(() => {
    registerCajaRealtimeHandler(
      (event: RealtimeEvent) => {
        const cajaActual =
          cajaSeleccionadaRef.current

        if (
          event.type === 'CAJA_CERRADA' &&
          cajaActual &&
          event.cajaId === cajaActual.id
        ) {
          console.log(
            '[CAJA] Caja cerrada remotamente → reset total'
          )

          /* 🔥 RESET TOTAL DEL FLUJO LOCAL */
          setShowCierreModal(false)
          setResumenPrevio(null)
          setMontoFinal('')

          setAperturaActiva(null)
          setCajaSeleccionada(null)
        }
      }
    )

    /* Conectar SSE UNA sola vez por sesión */
    connectCajaRealtime()
  }, [])

  /* =====================================================
     SELECCIONAR CAJA
     - No asume que esté abierta
     - Valida contra backend
  ===================================================== */
  const seleccionarCaja = useCallback(
    async (caja: Caja) => {
      setValidandoCaja(true)
      setError(undefined)

      try {
        setCajaSeleccionada(caja)

        const apertura =
          await getAperturaActiva(caja.id)

        setAperturaActiva(apertura)
      } catch (e) {
        console.error(e)

        setCajaSeleccionada(null)
        setAperturaActiva(null)
        setError('No se pudo seleccionar la caja')
      } finally {
        setValidandoCaja(false)
      }
    },
    []
  )

  /* =====================================================
     ABRIR CAJA
  ===================================================== */
  const abrirCaja = useCallback(
    async (montoInicial: number) => {
      if (!cajaSeleccionada) return

      setCargando(true)
      setError(undefined)

      try {
        const apertura =
          await apiAbrirCaja({
            cajaId: cajaSeleccionada.id,
            montoInicial,
          })

        setAperturaActiva(apertura)
      } catch (e) {
        console.error(e)
        setError('No se pudo abrir la caja')
      } finally {
        setCargando(false)
      }
    },
    [cajaSeleccionada]
  )

  /* =====================================================
     CIERRE – PASO 1 (resumen previo)
  ===================================================== */
  const iniciarCierre = useCallback(
    async () => {
      if (!cajaSeleccionada) return

      setCargando(true)
      setError(undefined)

      try {
        const resumen =
          await getResumenPrevioCaja(
            cajaSeleccionada.id
          )

        setResumenPrevio(resumen)
        setMontoFinal(
          String(resumen.efectivoEsperado)
        )
        setShowCierreModal(true)
      } catch (e) {
        console.error(e)
        setError(
          'No se pudo obtener el resumen de caja'
        )
      } finally {
        setCargando(false)
      }
    },
    [cajaSeleccionada]
  )

  /* =====================================================
     CIERRE – PASO 2 (confirmar)
     - Backend cierra
     - Front resetea
     - SSE notifica a otros terminals
  ===================================================== */
  const confirmarCierre = useCallback(
    async () => {
      if (!cajaSeleccionada) return

      setClosingCaja(true)
      setError(undefined)

      try {
        await cerrarCajaAutomatico({
          cajaId: cajaSeleccionada.id,
          montoFinal: Number(montoFinal),
        })

        /* 🔥 RESET LOCAL */
        setShowCierreModal(false)
        setResumenPrevio(null)
        setMontoFinal('')

        setAperturaActiva(null)
        setCajaSeleccionada(null)
      } catch (e) {
        console.error(e)
        setError('No se pudo cerrar la caja')
      } finally {
        setClosingCaja(false)
      }
    },
    [cajaSeleccionada, montoFinal]
  )

  const cancelarCierre = useCallback(() => {
    setShowCierreModal(false)
    setResumenPrevio(null)
    setMontoFinal('')
  }, [])

  /* =====================================================
     CONTEXT VALUE
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
      seleccionarCaja,
      abrirCaja,
      iniciarCierre,
      confirmarCierre,
      cancelarCierre,
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