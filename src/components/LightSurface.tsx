import { useAppStore, selectActiveProfile } from '@/store'
import { blendWithTemperature } from '@/lib/colorTemperature'

export default function LightSurface() {
  const { lightColor, brightness, colorTemperature, ringFormat, innerRadius, outerRadius } =
    useAppStore(selectActiveProfile)

  const blendedColor = blendWithTemperature(lightColor, colorTemperature)
  const brightnessFilter = `brightness(${brightness / 100})`

  if (ringFormat === 'circle') {
    return (
      <div
        data-testid="light-surface"
        data-ring-format="circle"
        className="fixed inset-0 overflow-hidden"
        style={{
          background: `radial-gradient(circle at center / min(100vw,100vh) min(100vw,100vh), transparent ${innerRadius}%, ${blendedColor} ${innerRadius}%, ${blendedColor} ${outerRadius}%, transparent ${outerRadius}%)`,
          filter: brightnessFilter,
        }}
      />
    )
  }

  if (ringFormat === 'border') {
    return (
      <div
        data-testid="light-surface"
        data-ring-format="border"
        className="fixed inset-0 overflow-hidden"
        style={
          {
            '--ring-color': blendedColor,
            '--ring-inner': `${innerRadius}`,
            '--ring-outer': `${outerRadius}`,
            boxShadow: `inset 0 0 0 calc((${outerRadius} - ${innerRadius}) * min(100vw, 100vh) / 200) ${blendedColor}`,
            filter: brightnessFilter,
          } as React.CSSProperties
        }
      />
    )
  }

  // ringFormat === 'full'
  return (
    <div
      data-testid="light-surface"
      data-ring-format="full"
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: blendedColor,
        filter: brightnessFilter,
      }}
    />
  )
}
