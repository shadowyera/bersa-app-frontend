import type { DocumentoReceptor } from '../../../../domains/venta/domain/venta.types';
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
} from 'react'


/* =====================================================
   Helpers RUT
===================================================== */

function limpiarRut(value: string) {
  return value
    .replace(/\./g, '')
    .replace(/[^0-9kK-]/g, '')
    .toUpperCase()
}

function validarRut(rut: string): boolean {
  if (!rut.includes('-')) return false

  const [body, dv] = rut.split('-')
  if (!body || !dv) return false
  if (!/^\d+$/.test(body)) return false

  let suma = 0
  let multiplo = 2

  for (let i = body.length - 1; i >= 0; i--) {
    suma += Number(body[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }

  const resto = 11 - (suma % 11)
  const dvEsperado =
    resto === 11
      ? '0'
      : resto === 10
        ? 'K'
        : String(resto)

  return dvEsperado === dv
}

/* =====================================================
   Props
===================================================== */

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (receptor: DocumentoReceptor) => void
}

/* =====================================================
   Component
===================================================== */

function DocumentoReceptorModal({
  open,
  onClose,
  onConfirm,
}: Props) {

  const rutRef = useRef<HTMLInputElement>(null)

  const [rut, setRut] = useState('')
  const [razonSocial, setRazonSocial] =
    useState('')
  const [giro, setGiro] = useState('')
  const [direccion, setDireccion] =
    useState('')
  const [comuna, setComuna] = useState('')
  const [ciudad, setCiudad] = useState('')

  /* ===============================
     Autofocus
  =============================== */

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        rutRef.current?.focus()
      }, 50)
    }
  }, [open])

  /* ===============================
     Rut state
  =============================== */

  const [body, dv] = rut.split('-')

  const rutCompleto =
    rut.includes('-') &&
    body?.length >= 7 &&
    dv?.length === 1

  const rutValido =
    rutCompleto && validarRut(rut)

  /* ===============================
     Validation
  =============================== */

  const formValido =
    rutValido &&
    razonSocial &&
    giro &&
    direccion &&
    comuna &&
    ciudad

  /* ===============================
     Keyboard
  =============================== */

  useEffect(() => {

    if (!open) return

    const handler = (e: KeyboardEvent) => {

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }

      if (e.key === 'Enter') {
        e.preventDefault()
        if (formValido) {
          handleConfirm()
        }
      }
    }

    document.addEventListener(
      'keydown',
      handler
    )

    return () =>
      document.removeEventListener(
        'keydown',
        handler
      )

  }, [open, formValido])

  /* ===============================
     Confirm
  =============================== */

  const handleConfirm = useCallback(() => {

    if (!formValido) return

    onConfirm({
      rut,
      razonSocial,
      giro,
      direccion,
      comuna,
      ciudad,
    })

  }, [
    rut,
    razonSocial,
    giro,
    direccion,
    comuna,
    ciudad,
    formValido,
    onConfirm,
  ])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-[440px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Datos del cliente
          </h2>
          <p className="text-sm text-slate-400">
            Obligatorio para factura
          </p>
        </div>

        {/* Form */}
        <div className="space-y-3">

          {/* RUT */}
          <div className="relative">

            <input
              ref={rutRef}
              value={rut}
              onChange={e =>
                setRut(
                  limpiarRut(
                    e.target.value
                  )
                )
              }
              placeholder="RUT (sin puntos, con guion)"
              className={`
                w-full px-3 py-2 pr-10 rounded
                bg-slate-800 text-white
                border
                ${rutCompleto
                  ? rutValido
                    ? 'border-emerald-500'
                    : 'border-red-500'
                  : 'border-slate-700'
                }
                focus:outline-none
                focus:ring-2
                focus:ring-emerald-500
              `}
            />

            {rutCompleto && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                {rutValido ? (
                  <span className="text-emerald-400">
                    ✓
                  </span>
                ) : (
                  <span className="text-red-400">
                    ✕
                  </span>
                )}
              </div>
            )}

            {rutCompleto && !rutValido && (
              <p className="text-xs text-red-400 mt-1">
                RUT inválido
              </p>
            )}
          </div>

          {/* Campos */}
          <Field
            value={razonSocial}
            onChange={setRazonSocial}
            placeholder="Razón social"
          />

          <Field
            value={giro}
            onChange={setGiro}
            placeholder="Giro"
          />

          <Field
            value={direccion}
            onChange={setDireccion}
            placeholder="Dirección"
          />

          <Field
            value={comuna}
            onChange={setComuna}
            placeholder="Comuna"
          />

          <Field
            value={ciudad}
            onChange={setCiudad}
            placeholder="Ciudad"
          />

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-6">

          <button
            onMouseDown={e => {
              e.preventDefault()
              onClose()
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Cancelar
          </button>

          <button
            disabled={!formValido}
            onMouseDown={e => {
              e.preventDefault()
              handleConfirm()
            }}
            className={`px-4 py-2 rounded-xl text-white transition ${formValido
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-slate-600 cursor-not-allowed'
              }`}
          >
            Guardar
          </button>

        </div>

      </div>
    </div>
  )
}

export default memo(DocumentoReceptorModal)

/* =====================================================
   Reusable Field
===================================================== */

interface FieldProps {
  value: string
  onChange: (v: string) => void
  placeholder: string
}

function Field({
  value,
  onChange,
  placeholder,
}: FieldProps) {
  return (
    <input
      value={value}
      onChange={e =>
        onChange(e.target.value)
      }
      placeholder={placeholder}
      className="
        w-full px-3 py-2 rounded
        bg-slate-800 text-white
        border border-slate-700
        focus:outline-none
        focus:ring-2
        focus:ring-emerald-500
      "
    />
  )
}