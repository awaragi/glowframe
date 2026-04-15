import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { SpotColorProfile } from '@/store'

export default function SpotColorModeShortcuts() {
  const profile = useAppStore(selectActiveProfile) as { id: string } & SpotColorProfile
  const updateProfile = useAppStore((s) => s.updateProfile)

  useKeyboardShortcuts([
    {
      key: ']',
      handler: () => {
        updateProfile(profile.id, {
          radius: Math.min(100, profile.radius + RADIUS_STEP),
        })
      },
    },
    {
      key: '[',
      handler: () => {
        updateProfile(profile.id, {
          radius: Math.max(0, profile.radius - RADIUS_STEP),
        })
      },
    },
  ])

  return null
}
