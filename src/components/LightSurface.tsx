import { useAppStore, selectActiveProfile } from '@/store'
import type { Profile } from '@/store'
import FullModeSurface from '@/components/light-modes/FullModeSurface'
import FullColorModeSurface from '@/components/light-modes/FullColorModeSurface'
import RingModeSurface from '@/components/light-modes/RingModeSurface'
import RingColorModeSurface from '@/components/light-modes/RingColorModeSurface'
import SpotModeSurface from '@/components/light-modes/SpotModeSurface'
import SpotColorModeSurface from '@/components/light-modes/SpotColorModeSurface'
import ClockOverlay from '@/components/ClockOverlay'

function renderModeSurface(profile: Profile) {
  switch (profile.light.mode) {
    case 'full':
      return <FullModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
    case 'full-color':
      return <FullColorModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
    case 'ring':
      return <RingModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
    case 'ring-color':
      return <RingColorModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
    case 'spot':
      return <SpotModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
    case 'spot-color':
      return <SpotColorModeSurface profile={{ id: profile.id, name: profile.name, ...profile.light }} />
  }
}

export default function LightSurface() {
  const profile = useAppStore(selectActiveProfile)

  return (
    <>
      {renderModeSurface(profile)}
      <ClockOverlay />
    </>
  )
}
