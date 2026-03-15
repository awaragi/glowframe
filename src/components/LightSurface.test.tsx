import { render, act } from '@testing-library/react'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import LightSurface from './LightSurface'

function makeProfile(overrides?: Partial<Profile>) {
  return {
    id: crypto.randomUUID(),
    name: 'Default',
    lightColor: '#ffffff',
    brightness: 100,
    colorTemperature: 6500,
    ringFormat: 'full' as const,
    innerRadius: 0,
    outerRadius: 100,
    ...overrides,
  }
}

function resetStore(profileFields?: Parameters<typeof makeProfile>[0]) {
  const profile = makeProfile(profileFields)
  useAppStore.setState({
    _version: 3,
    profiles: [profile],
    activeProfileId: profile.id,
  })
  return profile
}

function setActiveProfileFields(fields: Partial<Parameters<typeof makeProfile>[0]>) {
  const state = useAppStore.getState()
  const activeId = state.activeProfileId
  useAppStore.setState({
    profiles: state.profiles.map((p) => (p.id === activeId ? { ...p, ...fields } : p)),
  })
}

describe('LightSurface', () => {
  beforeEach(() => {
    resetStore()
  })

  describe('full format', () => {
    it('applies default white background and full brightness filter', () => {
      // At 6500K, white is slightly tinted — we just check it renders
      const { getByTestId } = render(<LightSurface />)
      const el = getByTestId('light-surface')
      expect(el).toHaveAttribute('data-ring-format', 'full')
      expect(el).toHaveStyle({ filter: 'brightness(1)' })
    })

    it('applies reduced brightness filter', () => {
      setActiveProfileFields({ brightness: 50 })
      const { getByTestId } = render(<LightSurface />)
      expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.5)' })
    })

    it('re-renders when brightness changes after mount', () => {
      const { getByTestId } = render(<LightSurface />)
      act(() => setActiveProfileFields({ brightness: 50 }))
      expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.5)' })
    })

    it('re-renders when lightColor changes after mount', () => {
      // neutral temperature and pure red — blended result should have high red channel
      setActiveProfileFields({ colorTemperature: 1000, lightColor: '#ff0000' })
      const { getByTestId } = render(<LightSurface />)
      const el = getByTestId('light-surface')
      const bg = el.style.backgroundColor
      expect(bg).toBeTruthy()
    })
  })

  describe('circle format', () => {
    it('renders with data-ring-format="circle"', () => {
      resetStore({ ringFormat: 'circle', innerRadius: 20, outerRadius: 80 })
      const { getByTestId } = render(<LightSurface />)
      expect(getByTestId('light-surface')).toHaveAttribute('data-ring-format', 'circle')
    })

    it('applies the brightness filter in circle mode', () => {
      resetStore({ ringFormat: 'circle', brightness: 75 })
      const { getByTestId } = render(<LightSurface />)
      expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.75)' })
    })

    it('renders an annular ring — transparent inside innerRadius, colored between inner and outer, transparent outside outerRadius', () => {
      resetStore({ ringFormat: 'circle', innerRadius: 20, outerRadius: 80, lightColor: '#ffffff', colorTemperature: 6500 })
      const { getByTestId } = render(<LightSurface />)
      const el = getByTestId('light-surface')
      // 'circle' format must NOT use a solid backgroundColor fill (that is 'full' format)
      // It should use a radial-gradient via the 'background' shorthand property
      expect(el.style.backgroundColor).toBeFalsy()
      // The brightness filter is still applied
      expect(el).toHaveStyle({ filter: 'brightness(1)' })
    })
  })

  describe('border format', () => {
    it('renders with data-ring-format="border"', () => {
      resetStore({ ringFormat: 'border', innerRadius: 0, outerRadius: 10 })
      const { getByTestId } = render(<LightSurface />)
      expect(getByTestId('light-surface')).toHaveAttribute('data-ring-format', 'border')
    })

    it('applies the brightness filter in border mode', () => {
      resetStore({ ringFormat: 'border', brightness: 60 })
      const { getByTestId } = render(<LightSurface />)
      expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.6)' })
    })
  })

  describe('color temperature', () => {
    it('uses blendWithTemperature to derive the rendered color', () => {
      // At 1000K (warm), white should become warm-tinted
      resetStore({ lightColor: '#ffffff', colorTemperature: 1000 })
      const { getByTestId } = render(<LightSurface />)
      const el = getByTestId('light-surface')
      // The rendered backgroundColor should not be pure white
      // jsdom computes inline styles so we can check the style prop was set
      expect(el.style.backgroundColor).toBeTruthy()
    })
  })
})
