import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { BRIGHTNESS_STEP, TEMPERATURE_STEP, RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { RingProfile } from '@/store'

export default function RingModeShortcuts() {
  const profile = useAppStore(selectActiveProfile) as { id: string } & RingProfile
  const updateProfile = useAppStore((s) => s.updateProfile)

  useKeyboardShortcuts([
    {
      key: 'ArrowUp',
      handler: () => {
        updateProfile(profile.id, {
          lightBrightness: Math.min(100, profile.lightBrightness + BRIGHTNESS_STEP),
        })
      },
    },
    {
      key: 'ArrowDown',
      handler: () => {
        updateProfile(profile.id, {
          lightBrightness: Math.max(0, profile.lightBrightness - BRIGHTNESS_STEP),
        })
      },
    },
    {
      key: 'ArrowRight',
      handler: () => {
        updateProfile(profile.id, {
          lightTemperature: Math.min(10000, profile.lightTemperature + TEMPERATURE_STEP),
        })
      },
    },
    {
      key: 'ArrowLeft',
      handler: () => {
        updateProfile(profile.id, {
          lightTemperature: Math.max(1000, profile.lightTemperature - TEMPERATURE_STEP),
        })
      },
    },
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
