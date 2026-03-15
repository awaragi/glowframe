import { render } from '@testing-library/react'
import SpotModeSurface from './SpotModeSurface'

function makeProfile(overrides?: Partial<{
  id: string
  name: string
  lightTemperature: number
  lightBrightness: number
  radius: number
  backgroundLightTemperature: number
  backgroundLightBrightness: number
}>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'spot' as const,
    lightTemperature: 6500,
    lightBrightness: 100,
    radius: 40,
    backgroundLightTemperature: 0,
    backgroundLightBrightness: 0,
    ...overrides,
  }
}

describe('SpotModeSurface', () => {
  it('has data-mode="spot" on root', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'spot')
  })

  it('renders both bg and fg layers', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface-bg')).toBeInTheDocument()
    expect(getByTestId('light-surface-fg')).toBeInTheDocument()
  })

  it('foreground has spot radial-gradient', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile({ radius: 40 })} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toMatch(/radial-gradient/)
    expect(fg.style.backgroundImage).toContain('40%')
  })

  it('background is fully black at default backgroundLightBrightness 0', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile({ backgroundLightBrightness: 0 })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ filter: 'brightness(0)' })
  })

  it('background brightness reflects backgroundLightBrightness', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile({ backgroundLightBrightness: 75 })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ filter: 'brightness(0.75)' })
  })

  it('foreground radial-gradient shape uses closest-side so 100% maps to max screen dimension', () => {
    const { getByTestId } = render(<SpotModeSurface profile={makeProfile()} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toMatch(/circle\s+closest-side/)
  })
})
