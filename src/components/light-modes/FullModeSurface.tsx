import { blendWithTemperature } from '@/lib/colorTemperature'
import type { FullProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & FullProfile
}

export default function FullModeSurface({ profile }: Props) {
  const bgColor = blendWithTemperature('#ffffff', profile.lightTemperature)
  return (
    <div
      data-testid="light-surface"
      data-mode="full"
      className="fixed inset-0"
      style={{
        backgroundColor: bgColor,
        filter: `brightness(${profile.lightBrightness / 100})`,
      }}
    />
  )
}
