import { useEffect } from 'react'
import { MODE_OVERLAY_DURATION_MS } from '@/lib/modeCycle'

interface ModeNameOverlayProps {
  label: string | null
  onDismiss: () => void
}

export default function ModeNameOverlay({ label, onDismiss }: ModeNameOverlayProps) {
  useEffect(() => {
    if (!label) return
    const id = setTimeout(onDismiss, MODE_OVERLAY_DURATION_MS)
    return () => clearTimeout(id)
  }, [label, onDismiss])

  if (!label) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-10"
      role="status"
      aria-live="polite"
    >
      <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-2xl font-medium">
        {label}
      </div>
    </div>
  )
}
