import { useAppStore } from '@/store'

export default function LightSurface() {
  const lightColor = useAppStore((s) => s.lightColor)
  const brightness = useAppStore((s) => s.brightness)

  return (
    <div
      data-testid="light-surface"
      className="fixed inset-0 overflow-hidden"
      style={{
        backgroundColor: lightColor,
        filter: `brightness(${brightness / 100})`,
      }}
    />
  )
}
