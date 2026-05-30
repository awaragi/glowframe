import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import SpotModeShortcuts from './SpotModeShortcuts'
import { useAppStore, CLOCK_DEFAULTS } from '@/store'
import type { Profile } from '@/store'
import type { SpotProfile } from '@/lib/modeDefaults'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'

function fireKeydown(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const baseLight: SpotProfile = {
  mode: 'spot',
  lightTemperature: 6500,
  lightBrightness: 100,
  radius: 40,
  backgroundLightTemperature: 0,
  backgroundLightBrightness: 0,
}

const baseProfile: Profile = {
  id: 'test-spot',
  name: 'Test Spot',
  light: { ...baseLight },
  clock: { ...CLOCK_DEFAULTS },
}

type LightOverrides = Partial<SpotProfile>

function getLight() {
  return useAppStore.getState().profiles[0].light as SpotProfile
}

function resetStore(lightOverrides: LightOverrides = {}) {
  useAppStore.setState({
    _version: 5,
    profiles: [{ ...baseProfile, light: { ...baseLight, ...lightOverrides } }],
    activeProfileId: baseProfile.id,
  })
}

describe('SpotModeShortcuts', () => {
  beforeEach(() => resetStore())

  it('] increases radius by RADIUS_STEP', () => {
    render(<SpotModeShortcuts />)
    fireKeydown(']')
    expect(getLight().radius).toBe(40 + RADIUS_STEP)
  })

  it('[ decreases radius by RADIUS_STEP', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('[')
    expect(getLight().radius).toBe(40 - RADIUS_STEP)
  })

  it('] clamps radius at 100', () => {
    resetStore({ radius: 99 })
    render(<SpotModeShortcuts />)
    fireKeydown(']')
    expect(getLight().radius).toBe(100)
  })

  it('[ clamps radius at 0', () => {
    resetStore({ radius: 1 })
    render(<SpotModeShortcuts />)
    fireKeydown('[')
    expect(getLight().radius).toBe(0)
  })

  it('{ does nothing', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('{')
    expect(getLight().radius).toBe(40)
  })

  it('} does nothing', () => {
    render(<SpotModeShortcuts />)
    fireKeydown('}')
    expect(getLight().radius).toBe(40)
  })
})
