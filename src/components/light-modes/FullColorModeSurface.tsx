import type { FullColorProfile } from '@/store'

interface Props {
  profile: { id: string; name: string } & FullColorProfile
}

export default function FullColorModeSurface({ profile }: Props) {
  return (
    <div
      data-testid="light-surface"
      data-mode="full-color"
      className="fixed inset-0"
      style={{ backgroundColor: profile.lightColor }}
    />
  )
}
