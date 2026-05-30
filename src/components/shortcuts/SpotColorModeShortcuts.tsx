import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { SpotColorProfile } from '@/store'

export default function SpotColorModeShortcuts() {
  const profile = useAppStore(selectActiveProfile)
  const light = profile.light as SpotColorProfile
  const updateLight = useAppStore((s) => s.updateLight)

  useKeyboardShortcuts([
    {
      key: ']',
      handler: () => {
        updateLight(profile.id, {
          radius: Math.min(100, light.radius + RADIUS_STEP),
        })
      },
    },
    {
      key: '[',
      handler: () => {
        updateLight(profile.id, {
          radius: Math.max(0, light.radius - RADIUS_STEP),
        })
      },
    },
  ])

  return null
}
