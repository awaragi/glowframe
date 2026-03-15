import { render } from '@testing-library/react'
import FullColorModeSurface from './FullColorModeSurface'

function makeProfile(overrides?: Partial<{ id: string; name: string; lightColor: string }>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'full-color' as const,
    lightColor: '#ff0000',
    ...overrides,
  }
}

describe('FullColorModeSurface', () => {
  it('has data-mode="full-color"', () => {
    const { getByTestId } = render(<FullColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'full-color')
  })

  it('has data-testid="light-surface"', () => {
    const { getByTestId } = render(<FullColorModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toBeInTheDocument()
  })

  it('uses lightColor as background color', () => {
    const { getByTestId } = render(<FullColorModeSurface profile={makeProfile({ lightColor: '#ff0000' })} />)
    expect(getByTestId('light-surface')).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('applies no filter style', () => {
    const { getByTestId } = render(<FullColorModeSurface profile={makeProfile()} />)
    const el = getByTestId('light-surface')
    expect(el.style.filter).toBe('')
  })
})
