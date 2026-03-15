import type { RingColorProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & RingColorProfile
}

export default function RingColorModeSurface({ profile }: Props) {
  const { lightColor, innerRadius, outerRadius, backgroundColor } = profile

  return (
    <div data-testid="light-surface" data-mode="ring-color" className="fixed inset-0">
      <div
        data-testid="light-surface-bg"
        className="fixed inset-0"
        style={{ backgroundColor }}
      />
      <div
        data-testid="light-surface-fg"
        className="fixed inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, transparent ${innerRadius}%, ${lightColor} ${innerRadius}%, ${lightColor} ${outerRadius}%, transparent ${outerRadius}%)`,
          backgroundSize: 'min(100vw, 100vh) min(100vw, 100vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  )
}
