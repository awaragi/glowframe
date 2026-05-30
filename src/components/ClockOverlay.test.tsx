import { render, screen } from '@testing-library/react'
import { useAppStore, CLOCK_DEFAULTS } from '@/store'
import type { Profile, ClockConfig } from '@/store'
import ClockOverlay from './ClockOverlay'

function makeProfileWithClock(clock: Partial<ClockConfig> = {}): Profile {
  return {
    id: crypto.randomUUID(),
    name: 'Test',
    light: { mode: 'full', lightTemperature: 6500, lightBrightness: 100 },
    clock: {
      ...CLOCK_DEFAULTS,
      enabled: false,
      position: 'bottom-right',
      size: 'medium',
      ...clock,
    },
  }
}

function resetStore(profile: Profile) {
  useAppStore.setState({
    _version: 5,
    profiles: [profile],
    activeProfileId: profile.id,
  })
}

describe('ClockOverlay', () => {
  it('renders when enabled', () => {
    resetStore(makeProfileWithClock({ enabled: true }))
    render(<ClockOverlay />)
    expect(screen.getByLabelText('Digital clock')).toBeInTheDocument()
  })

  it('renders nothing when disabled', () => {
    resetStore(makeProfileWithClock({ enabled: false }))
    render(<ClockOverlay />)
    expect(screen.queryByLabelText('Digital clock')).not.toBeInTheDocument()
  })

  it('applies top-4 and left-4 for top-left position', () => {
    resetStore(makeProfileWithClock({ enabled: true, position: 'top-left' }))
    render(<ClockOverlay />)
    const el = screen.getByLabelText('Digital clock')
    expect(el).toHaveClass('top-4')
    expect(el).toHaveClass('left-4')
  })

  it('applies bottom-4 and left-4 for bottom-left position', () => {
    resetStore(makeProfileWithClock({ enabled: true, position: 'bottom-left' }))
    render(<ClockOverlay />)
    const el = screen.getByLabelText('Digital clock')
    expect(el).toHaveClass('bottom-4')
    expect(el).toHaveClass('left-4')
  })

  it('applies bottom-4 and right-4 for bottom-right position', () => {
    resetStore(makeProfileWithClock({ enabled: true, position: 'bottom-right' }))
    render(<ClockOverlay />)
    const el = screen.getByLabelText('Digital clock')
    expect(el).toHaveClass('bottom-4')
    expect(el).toHaveClass('right-4')
  })

  it('applies text-2xl for small size', () => {
    resetStore(makeProfileWithClock({ enabled: true, size: 'small' }))
    render(<ClockOverlay />)
    const inner = screen.getByLabelText('Digital clock').firstChild as HTMLElement
    expect(inner).toHaveClass('text-2xl')
  })

  it('applies text-4xl for medium size', () => {
    resetStore(makeProfileWithClock({ enabled: true, size: 'medium' }))
    render(<ClockOverlay />)
    const inner = screen.getByLabelText('Digital clock').firstChild as HTMLElement
    expect(inner).toHaveClass('text-4xl')
  })

  it('applies text-6xl for large size', () => {
    resetStore(makeProfileWithClock({ enabled: true, size: 'large' }))
    render(<ClockOverlay />)
    const inner = screen.getByLabelText('Digital clock').firstChild as HTMLElement
    expect(inner).toHaveClass('text-6xl')
  })

  it('has a semi-transparent backdrop class on the inner element', () => {
    resetStore(makeProfileWithClock({ enabled: true }))
    render(<ClockOverlay />)
    const inner = screen.getByLabelText('Digital clock').firstChild as HTMLElement
    expect(inner).toHaveClass('bg-black/40')
  })

  it('has aria-label="Digital clock" and aria-live="off"', () => {
    resetStore(makeProfileWithClock({ enabled: true }))
    render(<ClockOverlay />)
    const el = screen.getByLabelText('Digital clock')
    expect(el).toHaveAttribute('aria-label', 'Digital clock')
    expect(el).toHaveAttribute('aria-live', 'off')
  })
})
