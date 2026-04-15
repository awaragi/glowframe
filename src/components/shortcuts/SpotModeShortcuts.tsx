import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { BRIGHTNESS_STEP, TEMPERATURE_STEP, RADIUS_STEP } from '@/lib/keyboardShortcutConstants'
import type { SpotProfile } from '@/store'

export default function SpotModeShortcuts() {
  const profile = useAppStore(selectActiveProfile) as { id: string } & SpotProfile
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
