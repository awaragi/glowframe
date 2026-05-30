import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { RingColorProfile } from '@/store'

export default function RingColorModeShortcuts() {
  const profile = useAppStore(selectActiveProfile)
  const light = profile.light as RingColorProfile
  const updateLight = useAppStore((s) => s.updateLight)

  useKeyboardShortcuts([
    {
      key: ']',
      handler: () => {
        updateLight(profile.id, {
          outerRadius: Math.min(100, light.outerRadius + RADIUS_STEP),
        })
      },
    },
    {
      key: '[',
      handler: () => {
        updateLight(profile.id, {
          outerRadius: Math.max(light.innerRadius + 1, light.outerRadius - RADIUS_STEP),
        })
      },
    },
    {
      key: '{',
      handler: () => {
        updateLight(profile.id, {
          innerRadius: Math.min(light.outerRadius - 1, light.innerRadius + RADIUS_STEP),
        })
      },
    },
    {
      key: '}',
      handler: () => {
        updateLight(profile.id, {
          innerRadius: Math.max(0, light.innerRadius - RADIUS_STEP),
        })
      },
    },
  ])

  return null
}
