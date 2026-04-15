import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import SpotModeShortcuts from './SpotModeShortcuts'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'

function fireKeydown(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const baseProfile: Profile = {
  id: 'test-spot',
  name: 'Test Spot',
  mode: 'spot',
  lightTemperature: 6500,
  lightBrightness: 100,
  radius: 40,
  backgroundLightTemperature: 0,
  backgroundLightBrightness: 0,
}

type SpotTestProfile = {
  id: string; name: string; mode: 'spot'
  lightTemperature: number; lightBrightness: number
  radius: number; backgroundLightTemperature: number; backgroundLightBrightness: number
}

function resetStore(overrides: Partial<SpotTestProfile> = {}) {
  useAppStore.setState({
    _version: 4,
    profiles: [{ ...baseProfile, ...overrides } as Profile],
    activeProfileId: baseProfile.id,
  })
}

describe('SpotModeShortcuts', () => {
  beforeEach(() => resetStore())

  it('] increases radius by RADIUS_STEP', () => {
    render(<SpotModeShortcuts />)
    fireKeydown(']')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(40 + RADIUS_STEP)
  })

  it('[ decreases radius by RADIUS_STEP', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('[')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(40 - RADIUS_STEP)
  })

  it('] clamps radius at 100', () => {
    resetStore({ radius: 99 })
    render(<SpotModeShortcuts />)
    fireKeydown(']')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(100)
  })

  it('[ clamps radius at 0', () => {
    resetStore({ radius: 1 })
    render(<SpotModeShortcuts />)
    fireKeydown('[')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(0)
  })

  it('{ does nothing', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('{')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(40) // unchanged
  })

  it('} does nothing', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('}')
    const p = useAppStore.getState().profiles[0] as SpotTestProfile
    expect(p.radius).toBe(40) // unchanged
  })
})
