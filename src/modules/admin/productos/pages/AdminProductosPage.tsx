import { useMemo, useState, useEffect } from 'react'

import ProductosFilters from '../ui/ProductosFilters'
import ProductosTable from '../ui/ProductosTable'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import type { Producto } from '@/domains/producto/domain/producto.types'
import { useProductosAdminQuery } from '@/domains/producto/hooks/useProductosQuery'
import { useProductoMutations } from '@/domains/producto/hooks/useProductoMutations'

type EstadoFiltro = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

const PAGE_SIZE = 10

export default function AdminProductosPage() {
  /* =====================================================
     State
  ===================================================== */

  const [search, setSearch] = useState('')
  const [estado, setEstado] =
    useState<EstadoFiltro>('TODOS')
  const [proveedorId, setProveedorId] =
    useState<string | undefined>(undefined)

  const [page, setPage] = useState(1)

  /* =====================================================
     Query Params
  ===================================================== */

  const includeInactive =
    estado === 'TODOS'
      ? true
      : estado === 'INACTIVOS'

  const {
    data,
    isLoading,
  } = useProductosAdminQuery({
    page,
    limit: PAGE_SIZE,
    includeInactive,
    search: search || undefined,
  })

  const productos = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const { toggleActivo } = useProductoMutations()

  /* =====================================================
     Reset page when filters change
  ===================================================== */

  useEffect(() => {
    setPage(1)
  }, [search, estado])

  /* =====================================================
     Derivados (solo proveedor filtro local)
  ===================================================== */

  const productosFiltrados = useMemo(() => {
    if (!proveedorId) return productos

    return productos.filter(
      p => p.proveedorId === proveedorId
    )
  }, [productos, proveedorId])

  const proveedores = useMemo(() => {
    const unique = new Set<string>()

    productos.forEach(p => {
      if (p.proveedorId) {
        unique.add(p.proveedorId)
      }
    })

    return Array.from(unique).map(id => ({
      id,
      nombre: id, // hasta integrar dominio proveedor
    }))
  }, [productos])

  /* =====================================================
     Handlers
  ===================================================== */

  const handleEdit = (producto: Producto) => {
    console.log('Editar', producto)
  }

  const handleToggle = (producto: Producto) => {
    toggleActivo(producto.id, !producto.activo)
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1)
    }
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <div className="p-6 space-y-6">
      <SectionHeader
        title="Productos"
        subtitle="Gestión completa del catálogo"
        actions={
          <Button>
            + Nuevo producto
          </Button>
        }
      />

      <ProductosFilters
        search={search}
        estado={estado}
        proveedorId={proveedorId}
        proveedores={proveedores}
        total={total}
        onSearchChange={setSearch}
        onEstadoChange={setEstado}
        onProveedorChange={setProveedorId}
      />

      <ProductosTable
        productos={productosFiltrados}
        loading={isLoading}
        canEdit
        onEdit={handleEdit}
        onToggle={handleToggle}
      />

      {/* Paginación simple */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Página {page} de {totalPages} · {total} resultados
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}