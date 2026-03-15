import { blendWithTemperature } from '@/lib/colorTemperature'
import type { RingProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & RingProfile
}

export default function RingModeSurface({ profile }: Props) {
  const {
    lightTemperature,
    lightBrightness,
    innerRadius,
    outerRadius,
    backgroundLightTemperature,
    backgroundLightBrightness,
  } = profile
  const fgColor = blendWithTemperature('#ffffff', lightTemperature)
  const bgColor = blendWithTemperature('#ffffff', backgroundLightTemperature)

  return (
    <div data-testid="light-surface" data-mode="ring" className="fixed inset-0">
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
          backgroundImage: `radial-gradient(circle, transparent ${innerRadius}%, ${fgColor} ${innerRadius}%, ${fgColor} ${outerRadius}%, transparent ${outerRadius}%)`,
          backgroundSize: 'min(100vw, 100vh) min(100vw, 100vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: `brightness(${lightBrightness / 100})`,
        }}
      />
    </div>
  )
}
