import { memo } from 'react'

interface PosLockProps {
  open: boolean
  children: React.ReactNode
}

function PosLock({ open, children }: PosLockProps) {
  if (!open) return null

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-background/70
        backdrop-blur-sm
        flex items-center justify-center
      "
    >
      <div className="w-full flex justify-center px-4">
        {children}
      </div>
    </div>
  )
}

export default memo(PosLock)