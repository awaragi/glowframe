import { useAppStore, selectActiveProfile } from '@/store'
import FullModeShortcuts from '@/components/shortcuts/FullModeShortcuts'
import FullColorModeShortcuts from '@/components/shortcuts/FullColorModeShortcuts'
import RingModeShortcuts from '@/components/shortcuts/RingModeShortcuts'
import RingColorModeShortcuts from '@/components/shortcuts/RingColorModeShortcuts'
import SpotModeShortcuts from '@/components/shortcuts/SpotModeShortcuts'
import SpotColorModeShortcuts from '@/components/shortcuts/SpotColorModeShortcuts'

export default function ActiveModeShortcuts() {
  const profile = useAppStore(selectActiveProfile)

  switch (profile.mode) {
    case 'full':
      return <FullModeShortcuts />
    case 'full-color':
      return <FullColorModeShortcuts />
    case 'ring':
      return <RingModeShortcuts />
    case 'ring-color':
      return <RingColorModeShortcuts />
    case 'spot':
      return <SpotModeShortcuts />
    case 'spot-color':
      return <SpotColorModeShortcuts />
  }
}
