import type { TipoPago } from './pos.types'

export const PAYMENT_METHODS: Record<TipoPago, {
    label: string
    description: string
    requiresInput: boolean
    allowsChange: boolean
}> = {
    EFECTIVO: {
        label: 'Pago en efectivo',
        description: 'Billetes y monedas',
        requiresInput: true,
        allowsChange: true
    },
    DEBITO: {
        label: 'Pago con débito',
        description: 'Tarjeta de débito o RedCompra',
        requiresInput: false,
        allowsChange: false
    },
    CREDITO: {
        label: 'Pago con crédito',
        description: 'Tarjeta de crédito',
        requiresInput: false,
        allowsChange: false
    },
    MIXTO: {
        label: 'Pago mixto',
        description: 'Efectivo + tarjeta',
        requiresInput: true,
        allowsChange: false
    },
    TRANSFERENCIA: {
        label: 'Transferencia',
        description: 'Pago por transferencia bancaria',
        requiresInput: false,
        allowsChange: false
    }
}
