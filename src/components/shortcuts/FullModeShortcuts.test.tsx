import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import FullModeShortcuts from './FullModeShortcuts'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import { BRIGHTNESS_STEP, TEMPERATURE_STEP } from '@/lib/keyboardShortcutConstants'

function fireKeydown(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const baseProfile: Profile = {
  id: 'test-full',
  name: 'Test',
  mode: 'full',
  lightTemperature: 5000,
  lightBrightness: 50,
}

type FullTestProfile = { id: string; name: string; mode: 'full'; lightTemperature: number; lightBrightness: number }

function resetStore(overrides: Partial<FullTestProfile> = {}) {
  useAppStore.setState({
    _version: 4,
    profiles: [{ ...baseProfile, ...overrides } as Profile],
    activeProfileId: baseProfile.id,
  })
}

describe('FullModeShortcuts', () => {
  beforeEach(() => resetStore())

  it('ArrowUp increases lightBrightness by BRIGHTNESS_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowUp')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightBrightness).toBe(50 + BRIGHTNESS_STEP)
  })

  it('ArrowDown decreases lightBrightness by BRIGHTNESS_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowDown')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightBrightness).toBe(50 - BRIGHTNESS_STEP)
  })

  it('ArrowUp clamps lightBrightness at 100', () => {
    resetStore({ lightBrightness: 98 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowUp')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightBrightness).toBe(100)
  })

  it('ArrowDown clamps lightBrightness at 0', () => {
    resetStore({ lightBrightness: 2 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowDown')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightBrightness).toBe(0)
  })

  it('ArrowRight increases lightTemperature by TEMPERATURE_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowRight')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightTemperature).toBe(5000 + TEMPERATURE_STEP)
  })

  it('ArrowLeft decreases lightTemperature by TEMPERATURE_STEP', () => {
    render(<FullModeShortcuts />)
    fireKeydown('ArrowLeft')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightTemperature).toBe(5000 - TEMPERATURE_STEP)
  })

  it('ArrowRight clamps lightTemperature at 10000', () => {
    resetStore({ lightTemperature: 9950 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowRight')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightTemperature).toBe(10000)
  })

  it('ArrowLeft clamps lightTemperature at 1000', () => {
    resetStore({ lightTemperature: 1050 })
    render(<FullModeShortcuts />)
    fireKeydown('ArrowLeft')
    const p = useAppStore.getState().profiles[0] as FullTestProfile
    expect(p.lightTemperature).toBe(1000)
  })
})
