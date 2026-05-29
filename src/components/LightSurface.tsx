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
  switch (profile.mode) {
    case 'full':
      return <FullModeSurface profile={profile} />
    case 'full-color':
      return <FullColorModeSurface profile={profile} />
    case 'ring':
      return <RingModeSurface profile={profile} />
    case 'ring-color':
      return <RingColorModeSurface profile={profile} />
    case 'spot':
      return <SpotModeSurface profile={profile} />
    case 'spot-color':
      return <SpotColorModeSurface profile={profile} />
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
