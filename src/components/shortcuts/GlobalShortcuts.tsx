import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { Profile } from '@/store'

interface GlobalShortcutsProps {
  onToggleFullscreen: () => void
  onToggleSettings: () => void
  onToggleHelp: () => void
  profiles: Profile[]
  setActiveProfile: (id: string) => void
}

export default function GlobalShortcuts({
  onToggleFullscreen,
  onToggleSettings,
  onToggleHelp,
  profiles,
  setActiveProfile,
}: GlobalShortcutsProps) {
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
