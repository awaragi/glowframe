import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import FullModeShortcuts from './FullModeShortcuts'
import { useAppStore, CLOCK_DEFAULTS } from '@/store'
import type { Profile } from '@/store'
import { BRIGHTNESS_STEP, TEMPERATURE_STEP } from '@/lib/keyboardShortcutConstants'

function fireKeydown(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const baseProfile: Profile = {
  id: 'test-full',
  name: 'Test',
  light: { mode: 'full', lightTemperature: 5000, lightBrightness: 50 },
  clock: { ...CLOCK_DEFAULTS },
}

type LightOverrides = { lightTemperature?: number; lightBrightness?: number }

function resetStore(overrides: LightOverrides = {}) {
  useAppStore.setState({
    _version: 5,
    profiles: [{ ...baseProfile, light: { ...baseProfile.light, ...overrides } }],
    activeProfileId: baseProfile.id,
  })
}

function getLight() {
  return useAppStore.getState().profiles[0].light as { mode: 'full'; lightTemperature: number; lightBrightness: number }
}

describe('FullModeShortcuts', () => {
  beforeEach(() => resetStore())

  it('ArrowUp increases lightBrightness by BRIGHTNESS_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowUp')
    expect(getLight().lightBrightness).toBe(50 + BRIGHTNESS_STEP)
  })

  it('ArrowDown decreases lightBrightness by BRIGHTNESS_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowDown')
    expect(getLight().lightBrightness).toBe(50 - BRIGHTNESS_STEP)
  })

  it('ArrowUp clamps lightBrightness at 100', () => {
    resetStore({ lightBrightness: 98 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowUp')
    expect(getLight().lightBrightness).toBe(100)
  })

  it('ArrowDown clamps lightBrightness at 0', () => {
    resetStore({ lightBrightness: 2 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowDown')
    expect(getLight().lightBrightness).toBe(0)
  })

  it('ArrowRight increases lightTemperature by TEMPERATURE_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowRight')
    expect(getLight().lightTemperature).toBe(5000 + TEMPERATURE_STEP)
  })

  it('ArrowLeft decreases lightTemperature by TEMPERATURE_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowLeft')
    expect(getLight().lightTemperature).toBe(5000 - TEMPERATURE_STEP)
  })

  it('ArrowRight clamps lightTemperature at 10000', () => {
    resetStore({ lightTemperature: 9950 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowRight')
    expect(getLight().lightTemperature).toBe(10000)
  })

  it('ArrowLeft clamps lightTemperature at 1000', () => {
    resetStore({ lightTemperature: 1050 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowLeft')
    expect(getLight().lightTemperature).toBe(1000)
  })
})
