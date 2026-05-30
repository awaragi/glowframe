import { useAppStore, selectActiveProfile } from '@/store'
import { useClockTime } from '@/hooks/useClockTime'

const POSITION_CLASSES: Record<string, string> = {
  'top-left': 'top-4 left-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-right': 'bottom-4 right-4',
}

const SIZE_CLASSES: Record<string, string> = {
  small: 'text-2xl',
  medium: 'text-4xl',
  large: 'text-6xl',
}

export default function ClockOverlay() {
  const profile = useAppStore(selectActiveProfile)
  const clock = profile.clock
  const time = useClockTime(clock.format)

  if (!clock.enabled) return null

  return (
    <div className={`fixed z-10 ${POSITION_CLASSES[clock.position]}`}>
      <div
        className={`bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1 text-white font-mono tabular-nums ${SIZE_CLASSES[clock.size]}`}
        aria-label="Digital clock"
        aria-live="off"
      >
        {time}
      </div>
    </div>
  )
}
