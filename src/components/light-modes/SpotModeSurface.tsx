import { blendWithTemperature } from '@/lib/colorTemperature'
import type { SpotProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & SpotProfile
}

export default function SpotModeSurface({ profile }: Props) {
  const {
    lightTemperature,
    lightBrightness,
    radius,
    backgroundLightTemperature,
    backgroundLightBrightness,
  } = profile
  const fgColor = blendWithTemperature('#ffffff', lightTemperature)
  const bgColor = blendWithTemperature('#ffffff', backgroundLightTemperature)

  return (
    <div data-testid="light-surface" data-mode="spot" className="fixed inset-0">
      <div
        data-testid="light-surface-bg"
        className="fixed inset-0"
        style={{
          backgroundColor: bgColor,
          filter: `brightness(${backgroundLightBrightness / 100})`,
        }}
      />
      <div
        data-testid="light-surface-fg"
        className="fixed inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${fgColor} 0%, ${fgColor} ${radius}%, transparent ${radius}%)`,
          backgroundSize: 'min(100vw, 100vh) min(100vw, 100vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: `brightness(${lightBrightness / 100})`,
        }}
      />
    </div>
  )
}
