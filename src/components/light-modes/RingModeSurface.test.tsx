import { render } from '@testing-library/react'
import RingModeSurface from './RingModeSurface'

function makeProfile(overrides?: Partial<{
  id: string
  name: string
  lightTemperature: number
  lightBrightness: number
  innerRadius: number
  outerRadius: number
  backgroundLightTemperature: number
  backgroundLightBrightness: number
}>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'ring' as const,
    lightTemperature: 6500,
    lightBrightness: 100,
    innerRadius: 20,
    outerRadius: 80,
    backgroundLightTemperature: 0,
    backgroundLightBrightness: 0,
    ...overrides,
  }
}

describe('RingModeSurface', () => {
  it('has data-mode="ring" on root', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'ring')
  })

  it('renders data-testid="light-surface-bg"', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface-bg')).toBeInTheDocument()
  })

  it('renders data-testid="light-surface-fg"', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface-fg')).toBeInTheDocument()
  })

  it('foreground has radial-gradient background style', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile()} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toMatch(/radial-gradient/)
  })

  it('background brightness filter reflects backgroundLightBrightness', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile({ backgroundLightBrightness: 50 })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ filter: 'brightness(0.5)' })
  })

  it('background is fully black at backgroundLightBrightness 0 (default)', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile({ backgroundLightBrightness: 0 })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ filter: 'brightness(0)' })
  })

  it('foreground gradient includes innerRadius and outerRadius stops', () => {
    const { getByTestId } = render(<RingModeSurface profile={makeProfile({ innerRadius: 20, outerRadius: 80 })} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toContain('20%')
    expect(fg.style.backgroundImage).toContain('80%')
  })
})
