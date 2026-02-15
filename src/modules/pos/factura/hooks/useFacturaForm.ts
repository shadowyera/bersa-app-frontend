import { useState } from 'react'
import type {
  CrearFacturaInput,
  FacturaItemInput,
  ReceptorFactura,
} from '../domain/factura.types'

export function useFacturaForm(
  ventaId: string
) {

  const [receptor, setReceptor] =
    useState<ReceptorFactura>({
      rut: '',
      razonSocial: '',
      giro: '',
      direccion: '',
      comuna: '',
      ciudad: '',
    })

  const [items, setItems] =
    useState<FacturaItemInput[]>([])

  const [aplicarIva, setAplicarIva] =
    useState(true)

  const [ivaRate, setIvaRate] =
    useState(0.19)

  function updateReceptor(
    field: keyof ReceptorFactura,
    value: string
  ) {
    setReceptor(r => ({
      ...r,
      [field]: value,
    }))
  }

  function addItem() {
    setItems(i => [
      ...i,
      {
        descripcion: '',
        cantidad: 1,
        precioUnitario: 0,
      },
    ])
  }

  function updateItem(
    index: number,
    field: keyof FacturaItemInput,
    value: any
  ) {
    setItems(i =>
      i.map((item, idx) =>
        idx === index
          ? { ...item, [field]: value }
          : item
      )
    )
  }

  function removeItem(index: number) {
    setItems(i =>
      i.filter((_, idx) => idx !== index)
    )
  }

  function buildPayload(): CrearFacturaInput {
    return {
      ventaId,
      receptor,
      items,
      aplicarIva,
      ivaRate,
    }
  }

  return {
    receptor,
    items,
    aplicarIva,
    ivaRate,
    setAplicarIva,
    setIvaRate,
    updateReceptor,
    addItem,
    updateItem,
    removeItem,
    buildPayload,
  }
}