import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAppStore, selectActiveProfile } from '@/store'
import { nextMode, MODE_LABELS } from '@/lib/modeCycle'
import type { Profile } from '@/store'

interface GlobalShortcutsProps {
  onToggleFullscreen: () => void
  onToggleSettings: () => void
  onToggleHelp: () => void
  onModeCycled: (label: string) => void
  profiles: Profile[]
  setActiveProfile: (id: string) => void
}

export default function GlobalShortcuts({
  onToggleFullscreen,
  onToggleSettings,
  onToggleHelp,
  onModeCycled,
  profiles,
  setActiveProfile,
}: GlobalShortcutsProps) {
  const activeProfile = useAppStore(selectActiveProfile)
  const switchMode = useAppStore((s) => s.switchMode)

  const bindings = [
    {
      key: 'f',
      handler: onToggleFullscreen,
    },
    {
      key: 's',
      handler: onToggleSettings,
    },
    {
      key: '?',
      handler: onToggleHelp,
    },
    {
      key: 'm',
      handler() {
        const next = nextMode(activeProfile.light.mode)
        switchMode(activeProfile.id, next)
        onModeCycled(MODE_LABELS[next])
      },
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      key: String(i + 1),
      handler: () => {
        const profile = profiles[i]
        if (profile) setActiveProfile(profile.id)
      },
    })),
  ]

  useKeyboardShortcuts(bindings)

  return null
}
