import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { RingColorProfile } from '@/store'

export default function RingColorModeShortcuts() {
  const profile = useAppStore(selectActiveProfile) as { id: string } & RingColorProfile
  const updateProfile = useAppStore((s) => s.updateProfile)

  useKeyboardShortcuts([
    {
      key: ']',
      handler: () => {
        updateProfile(profile.id, {
          outerRadius: Math.min(100, profile.outerRadius + RADIUS_STEP),
        })
      },
    },
    {
      key: '[',
      handler: () => {
        updateProfile(profile.id, {
          outerRadius: Math.max(profile.innerRadius + 1, profile.outerRadius - RADIUS_STEP),
        })
      },
    },
    {
      key: '{',
      handler: () => {
        updateProfile(profile.id, {
          innerRadius: Math.min(profile.outerRadius - 1, profile.innerRadius + RADIUS_STEP),
        })
      },
    },
    {
      key: '}',
      handler: () => {
        updateProfile(profile.id, {
          innerRadius: Math.max(0, profile.innerRadius - RADIUS_STEP),
        })
      },
    },
  ])

  return null
}
