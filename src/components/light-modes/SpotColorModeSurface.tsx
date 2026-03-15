import type { SpotColorProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & SpotColorProfile
}

export default function SpotColorModeSurface({ profile }: Props) {
  const { lightColor, radius, backgroundColor } = profile

  return (
    <div data-testid="light-surface" data-mode="spot-color" className="fixed inset-0">
      <div
        data-testid="light-surface-bg"
        className="fixed inset-0"
        style={{ backgroundColor }}
      />
      <div
        data-testid="light-surface-fg"
        className="fixed inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${lightColor} 0%, ${lightColor} ${radius}%, transparent ${radius}%)`,
          backgroundSize: 'min(100vw, 100vh) min(100vw, 100vh)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  )
}
