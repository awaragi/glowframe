import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import RingModeShortcuts from './RingModeShortcuts'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import { RADIUS_STEP } from '@/lib/keyboardShortcutConstants'

function fireKeydown(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
}

const baseProfile: Profile = {
  id: 'test-ring',
  name: 'Test Ring',
  mode: 'ring',
  lightTemperature: 6500,
  lightBrightness: 100,
  innerRadius: 20,
  outerRadius: 80,
  backgroundLightTemperature: 0,
  backgroundLightBrightness: 0,
}

type RingTestProfile = {
  id: string; name: string; mode: 'ring'
  lightTemperature: number; lightBrightness: number
  innerRadius: number; outerRadius: number
  backgroundLightTemperature: number; backgroundLightBrightness: number
}

function resetStore(overrides: Partial<RingTestProfile> = {}) {
  useAppStore.setState({
    _version: 4,
    profiles: [{ ...baseProfile, ...overrides } as Profile],
    activeProfileId: baseProfile.id,
  })
}

describe('RingModeShortcuts', () => {
  beforeEach(() => resetStore())

  it('] increases outerRadius by RADIUS_STEP', () => {
    render(<RingModeShortcuts />)
    fireKeydown(']')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.outerRadius).toBe(80 + RADIUS_STEP)
  })

  it('[ decreases outerRadius by RADIUS_STEP', () => {
    render(<RingModeShortcuts />)
    fireKeydown('[')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.outerRadius).toBe(80 - RADIUS_STEP)
  })

  it('[ clamps outerRadius to innerRadius+1', () => {
    resetStore({ innerRadius: 20, outerRadius: 21 })
    render(<RingModeShortcuts />)
    fireKeydown('[')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.outerRadius).toBe(21) // clamped to innerRadius+1
  })

  it('{ increases innerRadius by RADIUS_STEP', () => {
    render(<RingModeShortcuts />)
    fireKeydown('{')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.innerRadius).toBe(20 + RADIUS_STEP)
  })

  it('} decreases innerRadius by RADIUS_STEP', () => {
    render(<RingModeShortcuts />)
    fireKeydown('}')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.innerRadius).toBe(20 - RADIUS_STEP)
  })

  it('} clamps innerRadius at 0', () => {
    resetStore({ innerRadius: 1, outerRadius: 80 })
    render(<RingModeShortcuts />)
    fireKeydown('}')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.innerRadius).toBe(0)
  })

  it('{ clamps innerRadius to outerRadius-1', () => {
    resetStore({ innerRadius: 79, outerRadius: 80 })
    render(<RingModeShortcuts />)
    fireKeydown('{')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.innerRadius).toBe(79) // clamped to outerRadius-1
  })

  it('] clamps outerRadius at 100', () => {
    resetStore({ innerRadius: 20, outerRadius: 99 })
    render(<RingModeShortcuts />)
    fireKeydown(']')
    const p = useAppStore.getState().profiles[0] as RingTestProfile
    expect(p.outerRadius).toBe(100)
  })
})
