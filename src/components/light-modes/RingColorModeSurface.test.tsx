import { render } from '@testing-library/react'
import RingColorModeSurface from './RingColorModeSurface'

function makeProfile(overrides?: Partial<{
  id: string
  name: string
  lightColor: string
  innerRadius: number
  outerRadius: number
  backgroundColor: string
}>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'ring-color' as const,
    lightColor: '#00ff00',
    innerRadius: 20,
    outerRadius: 80,
    backgroundColor: '#000000',
    ...overrides,
  }
}

describe('RingColorModeSurface', () => {
  it('has data-mode="ring-color" on root', () => {
    const { getByTestId } = render(<RingColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'ring-color')
  })

  it('lightColor appears in foreground gradient', () => {
    const { getByTestId } = render(<RingColorModeSurface profile={makeProfile({ lightColor: '#00ff00' })} />)
    const fg = getByTestId('light-surface-fg')
    // JSDOM normalizes hex to rgb(), so check for the rgb equivalent
    expect(fg.style.backgroundImage).toMatch(/rgb\(0,\s*255,\s*0\)/)
  })

  it('backgroundColor is applied on background layer', () => {
    const { getByTestId } = render(<RingColorModeSurface profile={makeProfile({ backgroundColor: '#111111' })} />)
    expect(getByTestId('light-surface-bg')).toHaveStyle({ backgroundColor: '#111111' })
  })

  it('innerRadius and outerRadius appear in foreground gradient stops', () => {
    const { getByTestId } = render(<RingColorModeSurface profile={makeProfile({ innerRadius: 20, outerRadius: 80 })} />)
    const fg = getByTestId('light-surface-fg')
    expect(fg.style.backgroundImage).toContain('20%')
    expect(fg.style.backgroundImage).toContain('80%')
  })

  it('renders both bg and fg layers', () => {
    const { getByTestId } = render(<RingColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface-bg')).toBeInTheDocument()
    expect(getByTestId('light-surface-fg')).toBeInTheDocument()
  })
})
