import type { ReactNode } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
