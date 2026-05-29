import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import ClockShortcuts from './ClockShortcuts'
import { useAppStore, CLOCK_DEFAULTS } from '@/store'
import type { Profile, ClockConfig } from '@/store'

function fireKeydown(key: string, shiftKey = false) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
}

const baseProfile: Profile = {
  id: 'test-clock',
  name: 'Test',
  mode: 'full',
  lightTemperature: 5000,
  lightBrightness: 50,
  clock: { ...CLOCK_DEFAULTS, enabled: false, position: 'top-left', size: 'medium' },
}

function resetStore(clockOverrides: Partial<ClockConfig> = {}) {
  useAppStore.setState({
    _version: 4,
    profiles: [{ ...baseProfile, clock: { ...CLOCK_DEFAULTS, enabled: false, position: 'top-left', size: 'medium', ...clockOverrides } }],
    activeProfileId: baseProfile.id,
  })
}

function getClock(): ClockConfig {
  const p = useAppStore.getState().profiles[0]
  return p.clock ?? CLOCK_DEFAULTS
}

describe('ClockShortcuts — T key four-state cycle', () => {
  beforeEach(() => resetStore())

  it('T turns clock on at top-left when off', () => {
    render(<ClockShortcuts />)
    fireKeydown('t')
    const clock = getClock()
    expect(clock.enabled).toBe(true)
    expect(clock.position).toBe('top-left')
  })

  it('T advances from top-left to bottom-left', () => {
    resetStore({ enabled: true, position: 'top-left' })
    render(<ClockShortcuts />)
    fireKeydown('t')
    const clock = getClock()
    expect(clock.enabled).toBe(true)
    expect(clock.position).toBe('bottom-left')
  })

  it('T advances from bottom-left to bottom-right', () => {
    resetStore({ enabled: true, position: 'bottom-left' })
    render(<ClockShortcuts />)
    fireKeydown('t')
    const clock = getClock()
    expect(clock.enabled).toBe(true)
    expect(clock.position).toBe('bottom-right')
  })

  it('T turns clock off from bottom-right', () => {
    resetStore({ enabled: true, position: 'bottom-right' })
    render(<ClockShortcuts />)
    fireKeydown('t')
    expect(getClock().enabled).toBe(false)
  })

  it('T key also works with uppercase T', () => {
    render(<ClockShortcuts />)
    fireKeydown('T')
    expect(getClock().enabled).toBe(true)
  })
})

describe('ClockShortcuts — Shift+T size cycle', () => {
  beforeEach(() => resetStore({ size: 'small' }))

  it('Shift+T cycles size from small to medium', () => {
    render(<ClockShortcuts />)
    fireKeydown('T', true)
    expect(getClock().size).toBe('medium')
  })

  it('Shift+T cycles size from medium to large', () => {
    resetStore({ size: 'medium' })
    render(<ClockShortcuts />)
    fireKeydown('T', true)
    expect(getClock().size).toBe('large')
  })

  it('Shift+T cycles size from large back to small', () => {
    resetStore({ size: 'large' })
    render(<ClockShortcuts />)
    fireKeydown('T', true)
    expect(getClock().size).toBe('small')
  })

  it('Shift+T cycles size even when clock is disabled', () => {
    resetStore({ enabled: false, size: 'small' })
    render(<ClockShortcuts />)
    fireKeydown('T', true)
    expect(getClock().size).toBe('medium')
  })
})

describe('ClockShortcuts — focus guard', () => {
  beforeEach(() => resetStore())

  it('T is suppressed when an input has focus', () => {
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    render(<ClockShortcuts />)
    fireKeydown('t')
    expect(getClock().enabled).toBe(false)
    document.body.removeChild(input)
  })
})
