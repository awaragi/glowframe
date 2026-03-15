import { render } from '@testing-library/react'
import FullModeSurface from './FullModeSurface'
import { blendWithTemperature } from '@/lib/colorTemperature'

function makeProfile(overrides?: Partial<{ id: string; name: string; lightTemperature: number; lightBrightness: number }>) {
  return {
    id: 'test-id',
    name: 'Test',
    mode: 'full' as const,
    lightTemperature: 6500,
    lightBrightness: 100,
    ...overrides,
  }
}

describe('FullModeSurface', () => {
  it('has data-mode="full"', () => {
    const { getByTestId } = render(<FullModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toHaveAttribute('data-mode', 'full')
  })

  it('applies temperature-blended background color', () => {
    const profile = makeProfile({ lightTemperature: 6500 })
    const { getByTestId } = render(<FullModeSurface profile={profile} />)
    const expected = blendWithTemperature('#ffffff', 6500)
    const el = getByTestId('light-surface')
    // backgroundColor is set via style
    expect(el.style.backgroundColor).toBeTruthy()
    // The hex value from blendWithTemperature matches what is applied
    expect(el).toHaveStyle({ backgroundColor: expected })
  })

  it('applies brightness filter from lightBrightness', () => {
    const { getByTestId } = render(<FullModeSurface profile={makeProfile({ lightBrightness: 50 })} />)
    expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.5)' })
  })

  it('applies full brightness at lightBrightness 100', () => {
    const { getByTestId } = render(<FullModeSurface profile={makeProfile({ lightBrightness: 100 })} />)
    expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(1)' })
  })

  it('has data-testid="light-surface"', () => {
    const { getByTestId } = render(<FullModeSurface profile={makeProfile()} />)
    expect(getByTestId('light-surface')).toBeInTheDocument()
  })
})
