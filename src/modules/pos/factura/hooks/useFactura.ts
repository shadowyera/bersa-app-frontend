import { useState } from 'react'
import {
  apiCrearFactura,
  apiObtenerFacturasPorVenta,
} from '../api/factura.api'
import type {
  CrearFacturaInput,
  Factura,
} from '../domain/factura.types'

export function useFactura() {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function crearFactura(
    input: CrearFacturaInput
  ): Promise<Factura> {

    setLoading(true)
    setError(null)

    try {
      const factura =
        await apiCrearFactura(input)

      setLoading(false)
      return factura
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }

  async function obtenerFacturasPorVenta(
    ventaId: string
  ): Promise<Factura[]> {

    setLoading(true)
    setError(null)

    try {
      const facturas =
        await apiObtenerFacturasPorVenta(
          ventaId
        )

      setLoading(false)
      return facturas
    } catch (e: any) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }

  return {
    crearFactura,
    obtenerFacturasPorVenta,
    loading,
    error,
  }
}