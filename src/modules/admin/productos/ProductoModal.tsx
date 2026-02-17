import ProductoForm from './ProductoForm'
import type { Producto } from '../../../domains/producto/domain/producto.types';


type Props = {
  open: boolean
  producto: Producto | null
  onClose: () => void
  onSaved: () => void
}

export default function ProductoModal({
  open,
  producto,
  onClose,
  onSaved,
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">
            {producto ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4">
          <ProductoForm
            producto={producto}
            onSaved={() => {
              onSaved()
              onClose()
            }}
          />
        </div>
      </div>
    </div>
  )
}