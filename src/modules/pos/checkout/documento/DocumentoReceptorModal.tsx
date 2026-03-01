import type { DocumentoReceptor } from '@/domains/venta/domain/venta.types'
import {
  useState,
  useCallback,
  useEffect,
  useRef,
  memo,
} from 'react'
import ModalBase from '../../caja/ui/modals/ModalBase'
import { Button } from '@/shared/ui/button/button'

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
  const [razonSocial, setRazonSocial] = useState('')
  const [giro, setGiro] = useState('')
  const [direccion, setDireccion] = useState('')
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
     RUT State
  =============================== */

  const [body, dv] = rut.split('-')

  const rutCompleto =
    rut.includes('-') &&
    body?.length >= 7 &&
    dv?.length === 1

  const rutValido =
    rutCompleto && validarRut(rut)

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
        if (formValido) handleConfirm()
      }
    }

    document.addEventListener('keydown', handler)

    return () =>
      document.removeEventListener('keydown', handler)

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
    <ModalBase
      title="Datos del cliente"
      onClose={onClose}
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            disabled={!formValido}
            onClick={handleConfirm}
          >
            Guardar
          </Button>
        </div>
      }
    >

      <p className="text-sm text-muted-foreground mb-5">
        Obligatorio para emitir factura.
      </p>

      <div className="space-y-3">

        {/* RUT */}
        <div>
          <input
            ref={rutRef}
            value={rut}
            onChange={e =>
              setRut(limpiarRut(e.target.value))
            }
            placeholder="RUT (sin puntos, con guion)"
            className={`
              w-full px-3 py-2 rounded-lg
              bg-background text-foreground
              border
              ${
                rutCompleto
                  ? rutValido
                    ? 'border-success'
                    : 'border-danger'
                  : 'border-border'
              }
              focus:outline-none
              focus:ring-2
              focus:ring-primary/40
            `}
          />

          {rutCompleto && !rutValido && (
            <p className="text-xs text-danger mt-1">
              RUT inválido
            </p>
          )}
        </div>

        <Field value={razonSocial} onChange={setRazonSocial} placeholder="Razón social" />
        <Field value={giro} onChange={setGiro} placeholder="Giro" />
        <Field value={direccion} onChange={setDireccion} placeholder="Dirección" />
        <Field value={comuna} onChange={setComuna} placeholder="Comuna" />
        <Field value={ciudad} onChange={setCiudad} placeholder="Ciudad" />

      </div>

    </ModalBase>
  )
}

export default memo(DocumentoReceptorModal)

/* =====================================================
   Field Component
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
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="
        w-full px-3 py-2 rounded-lg
        bg-background text-foreground
        border border-border
        focus:outline-none
        focus:ring-2
        focus:ring-primary/40
      "
    />
  )
}