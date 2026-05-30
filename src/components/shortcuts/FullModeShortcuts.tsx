import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { BRIGHTNESS_STEP, TEMPERATURE_STEP } from '@/lib/keyboardShortcutConstants'
import type { FullProfile } from '@/store'

export default function FullModeShortcuts() {
  const profile = useAppStore(selectActiveProfile)
  const light = profile.light as FullProfile
  const updateLight = useAppStore((s) => s.updateLight)

  useKeyboardShortcuts([
    {
      key: 'ArrowUp',
      handler: () => {
        updateLight(profile.id, {
          lightBrightness: Math.min(100, light.lightBrightness + BRIGHTNESS_STEP),
        })
      },
    },
    {
      key: 'ArrowDown',
      handler: () => {
        updateLight(profile.id, {
          lightBrightness: Math.max(0, light.lightBrightness - BRIGHTNESS_STEP),
        })
      },
    },
    {
      key: 'ArrowRight',
      handler: () => {
        updateLight(profile.id, {
          lightTemperature: Math.min(10000, light.lightTemperature + TEMPERATURE_STEP),
        })
      },
    },
    {
      key: 'ArrowLeft',
      handler: () => {
        updateLight(profile.id, {
          lightTemperature: Math.max(1000, light.lightTemperature - TEMPERATURE_STEP),
        })
      },
    },
  ])

  return null
}
