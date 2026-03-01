import type { ReactNode } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

interface Props {
  children: ReactNode
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-0">
        <Header />

        <main className="flex-1 min-h-0 overflow-hidden p-4">
          {children}
        </main>
      </div>
    </div>
  )
}