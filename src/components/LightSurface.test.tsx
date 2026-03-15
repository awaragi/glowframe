import { render } from '@testing-library/react'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import LightSurface from './LightSurface'

function resetStore(profile: Profile) {
  useAppStore.setState({
    _version: 4,
    profiles: [profile],
    activeProfileId: profile.id,
  })
}

const baseId = () => crypto.randomUUID()

describe('LightSurface dispatcher', () => {
  it('renders data-mode="full" for full mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'full', lightTemperature: 6500, lightBrightness: 100 }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'full')
  })

  it('renders data-mode="full-color" for full-color mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'full-color', lightColor: '#ff0000' }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'full-color')
  })

  it('renders data-mode="ring" for ring mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'ring', lightTemperature: 6500, lightBrightness: 100, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 0, backgroundLightBrightness: 0 }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'ring')
  })

  it('renders data-mode="ring-color" for ring-color mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'ring-color', lightColor: '#00ff00', innerRadius: 20, outerRadius: 80, backgroundColor: '#000000' }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'ring-color')
  })

  it('renders data-mode="spot" for spot mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'spot', lightTemperature: 6500, lightBrightness: 100, radius: 40, backgroundLightTemperature: 0, backgroundLightBrightness: 0 }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'spot')
  })

  it('renders data-mode="spot-color" for spot-color mode profile', () => {
    const profile: Profile = { id: baseId(), name: 'Test', mode: 'spot-color', lightColor: '#0000ff', radius: 40, backgroundColor: '#000000' }
    resetStore(profile)
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'spot-color')
  })
})
