import { render } from '@testing-library/react'
import SpotColorModeSurface from './SpotColorModeSurface'

function makeProfile(overrides?: Partial<{
  id: string
  name: string
  lightColor: string
  radius: number
  backgroundColor: string
}>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'spot-color' as const,
    lightColor: '#0000ff',
    radius: 40,
    backgroundColor: '#000000',
    ...overrides,
  }
}

describe('SpotColorModeSurface', () => {
  it('has data-mode="spot-color" on root', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'spot-color')
  })

  it('lightColor appears in foreground gradient', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile({ lightColor: '#0000ff' })} />)
    const fg = getByTestId('light-surface-fg')
    // JSDOM normalizes hex to rgb(), so check for the rgb equivalent
    expect(fg.style.backgroundImage).toMatch(/rgb\(0,\s*0,\s*255\)/)
  })

  it('backgroundColor is applied on background layer', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile({ backgroundColor: '#222222' })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ backgroundColor: '#222222' })
  })

  it('radius appears in foreground gradient stops', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile({ radius: 40 })} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toContain('40%')
  })

  it('renders both bg and fg layers', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface-bg')).toBeInTheDocument()
    expect(getByTestId('light-surface-fg')).toBeInTheDocument()
  })

  it('foreground radial-gradient shape uses closest-side so 100% maps to max screen dimension', () => {
    const { getByTestId } = render(<SpotColorModeSurface profile={makeProfile()} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toMatch(/circle\s+closest-side/)
  })
})
