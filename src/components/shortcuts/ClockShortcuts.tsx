import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile, CLOCK_DEFAULTS } from '@/store'
import type { ClockConfig } from '@/store'

const POSITION_CYCLE: ClockConfig['position'][] = ['top-left', 'bottom-left', 'bottom-right']
const SIZE_CYCLE: ClockConfig['size'][] = ['small', 'medium', 'large']

export default function ClockShortcuts() {
  const activeProfile = useAppStore(selectActiveProfile)
  const updateProfile = useAppStore((s) => s.updateProfile)

  const clock = activeProfile.clock ?? CLOCK_DEFAULTS

  const bindings = [
    // Shift+T must be listed BEFORE plain t so the shift variant is matched first.
    {
      key: 't',
      shift: true,
      handler() {
        const idx = SIZE_CYCLE.indexOf(clock.size)
        const nextIdx = (idx + 1) % SIZE_CYCLE.length
        updateProfile(activeProfile.id, { clock: { size: SIZE_CYCLE[nextIdx] } })
      },
    },
    {
      key: 't',
      handler() {
        if (!clock.enabled) {
          updateProfile(activeProfile.id, { clock: { enabled: true, position: 'top-left' } })
        } else {
          const idx = POSITION_CYCLE.indexOf(clock.position)
          const isLast = idx === POSITION_CYCLE.length - 1
          if (isLast) {
            updateProfile(activeProfile.id, { clock: { enabled: false } })
          } else {
            updateProfile(activeProfile.id, { clock: { position: POSITION_CYCLE[idx + 1] } })
          }
        }
      },
    },
  ]

  useKeyboardShortcuts(bindings)

  return null
}
