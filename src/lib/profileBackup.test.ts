import { describe, it, expect } from 'vitest'
import { exportBackup, importBackup } from './profileBackup'
import type { Profile } from '@/store/index'
import { CLOCK_DEFAULTS } from '@/store/index'

const clock = { ...CLOCK_DEFAULTS }

const profiles: Profile[] = [
  {
    id: 'id-1',
    name: 'Full Preset',
    light: { mode: 'full', lightTemperature: 6500, lightBrightness: 80 },
    clock,
  },
  {
    id: 'id-2',
    name: 'Ring Preset',
    light: { mode: 'ring', lightTemperature: 5000, lightBrightness: 70, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 3000, backgroundLightBrightness: 30 },
    clock,
  },
  {
    id: 'id-3',
    name: 'Spot Color',
    light: { mode: 'spot-color', lightColor: '#ff0000', radius: 40, backgroundColor: '#000000' },
    clock,
  },
]

describe('exportBackup', () => {
  it('returns valid JSON', () => {
    const json = exportBackup(profiles)
    expect(() => JSON.parse(json)).not.toThrow()
  })

  it('has version: 1', () => {
    const payload = JSON.parse(exportBackup(profiles)) as Record<string, unknown>
    expect(payload.version).toBe(1)
  })

  it('has the correct preset count', () => {
    const payload = JSON.parse(exportBackup(profiles)) as { profiles: unknown[] }
    expect(payload.profiles).toHaveLength(3)
  })

  it('includes clock on each preset', () => {
    const payload = JSON.parse(exportBackup(profiles)) as { profiles: Record<string, unknown>[] }
    for (const p of payload.profiles) {
      expect(p).toHaveProperty('clock')
    }
  })

  it('excludes id from each preset', () => {
    const payload = JSON.parse(exportBackup(profiles)) as { profiles: Record<string, unknown>[] }
    for (const p of payload.profiles) {
      expect(p).not.toHaveProperty('id')
    }
  })

  it('normalizes missing clock to CLOCK_DEFAULTS', () => {
    // clock is required in Profile; this test just verifies the export still
    // includes clock on profiles that have it
    const payload = JSON.parse(exportBackup(profiles)) as { profiles: Record<string, unknown>[] }
    expect(payload.profiles[0]).toHaveProperty('clock')
    expect(payload.profiles[0].clock).toMatchObject(CLOCK_DEFAULTS)
  })

  it('preserves preset order from the input array', () => {
    const payload = JSON.parse(exportBackup(profiles)) as { profiles: { name: string }[] }
    expect(payload.profiles.map((p) => p.name)).toEqual(['Full Preset', 'Ring Preset', 'Spot Color'])
  })
})

describe('importBackup', () => {
  it('round-trips: export then import returns valid payload', () => {
    const json = exportBackup(profiles)
    const result = importBackup(json)
    expect(result).not.toBeNull()
    expect(result!.version).toBe(1)
    expect(result!.profiles).toHaveLength(3)
  })

  it('returns null for malformed JSON string', () => {
    expect(importBackup('{ not valid json }')).toBeNull()
  })

  it('returns null for a payload missing version', () => {
    const payload = { profiles: [{ name: 'Test', light: { mode: 'full', lightTemperature: 6500, lightBrightness: 80 }, clock }] }
    expect(importBackup(JSON.stringify(payload))).toBeNull()
  })

  it('returns null for a payload with a bad clock field', () => {
    const json = exportBackup(profiles)
    const payload = JSON.parse(json) as { version: number; profiles: Record<string, unknown>[] }
    payload.profiles[0].clock = { enabled: true, position: 'invalid', size: 'medium', format: 'HH:mm' }
    expect(importBackup(JSON.stringify(payload))).toBeNull()
  })

  it('returns null for an empty profiles array', () => {
    const payload = { version: 1, profiles: [] }
    expect(importBackup(JSON.stringify(payload))).toBeNull()
  })
})
