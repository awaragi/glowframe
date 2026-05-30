import { describe, it, expect } from 'vitest'
import { encodeProfile, decodeProfile } from './profileShare'
import type { Profile } from '@/store/index'
import { CLOCK_DEFAULTS } from '@/store/index'

const clock = { ...CLOCK_DEFAULTS }

const fullProfile: Profile = {
  id: 'test-id-1',
  name: 'Test Full',
  light: { mode: 'full', lightTemperature: 6500, lightBrightness: 80 },
  clock,
}

const fullColorProfile: Profile = {
  id: 'test-id-2',
  name: 'Test Full Color',
  light: { mode: 'full-color', lightColor: '#ff8800' },
  clock,
}

const ringProfile: Profile = {
  id: 'test-id-3',
  name: 'Test Ring',
  light: { mode: 'ring', lightTemperature: 5000, lightBrightness: 70, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 3000, backgroundLightBrightness: 30 },
  clock,
}

const ringColorProfile: Profile = {
  id: 'test-id-4',
  name: 'Test Ring Color',
  light: { mode: 'ring-color', lightColor: '#ffffff', innerRadius: 15, outerRadius: 75, backgroundColor: '#000000' },
  clock,
}

const spotProfile: Profile = {
  id: 'test-id-5',
  name: 'Test Spot',
  light: { mode: 'spot', lightTemperature: 4000, lightBrightness: 60, radius: 40, backgroundLightTemperature: 2000, backgroundLightBrightness: 20 },
  clock,
}

const spotColorProfile: Profile = {
  id: 'test-id-6',
  name: 'Test Spot Color',
  light: { mode: 'spot-color', lightColor: '#aabbcc', radius: 35, backgroundColor: '#111111' },
  clock,
}

describe('encodeProfile', () => {
  it('strips id from encoded output for full mode', () => {
    const encoded = encodeProfile(fullProfile)
    const decoded = JSON.parse(decodeURIComponent(encoded)) as Record<string, unknown>
    expect(decoded).not.toHaveProperty('id')
  })

  it('strips id from encoded output for ring-color mode', () => {
    const encoded = encodeProfile(ringColorProfile)
    const decoded = JSON.parse(decodeURIComponent(encoded)) as Record<string, unknown>
    expect(decoded).not.toHaveProperty('id')
  })

  it('includes clock object in encoded output for full mode', () => {
    const encoded = encodeProfile(fullProfile)
    const decoded = JSON.parse(decodeURIComponent(encoded)) as Record<string, unknown>
    expect(decoded).toHaveProperty('clock')
    expect(decoded.clock).toMatchObject(clock)
  })
})

describe('decodeProfile — round-trip for all 6 modes', () => {
  const profiles = [
    fullProfile,
    fullColorProfile,
    ringProfile,
    ringColorProfile,
    spotProfile,
    spotColorProfile,
  ]

  for (const profile of profiles) {
    it(`round-trips ${profile.light.mode} profile`, () => {
      const encoded = encodeProfile(profile)
      const result = decodeProfile(encoded)
      expect(result).not.toBeNull()
      expect(result!.light.mode).toBe(profile.light.mode)
      expect(result!.name).toBe(profile.name)
    })

    it(`round-trips clock for ${profile.light.mode} profile`, () => {
      const encoded = encodeProfile(profile)
      const result = decodeProfile(encoded)
      expect(result).not.toBeNull()
      expect(result!.clock).toMatchObject(clock)
    })
  }
})

describe('decodeProfile — invalid inputs return null', () => {
  it('returns null for completely invalid input', () => {
    expect(decodeProfile('not-valid-json')).toBeNull()
  })

  it('returns null for tampered JSON (extra field rejected by strict)', () => {
    const encoded = encodeProfile(fullProfile)
    const obj = JSON.parse(decodeURIComponent(encoded)) as Record<string, unknown>
    obj['injected'] = 'evil'
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when clock has an invalid position value', () => {
    const obj = {
      name: 'Test',
      light: { mode: 'full', lightTemperature: 6500, lightBrightness: 80 },
      clock: { enabled: true, position: 'invalid-position', size: 'medium', format: 'HH:mm' },
    }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when mode discriminant is missing', () => {
    const obj = { name: 'Test', light: { lightTemperature: 6500, lightBrightness: 100 }, clock }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when mode discriminant is unknown', () => {
    const obj = { name: 'Test', light: { mode: 'unknown-mode' }, clock }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when lightTemperature is out of range (too low)', () => {
    const obj = { name: fullProfile.name, light: { ...fullProfile.light, lightTemperature: 500 }, clock }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when lightTemperature is out of range (too high)', () => {
    const obj = { name: fullProfile.name, light: { ...fullProfile.light, lightTemperature: 99999 }, clock }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when lightBrightness is out of range', () => {
    const obj = { name: fullProfile.name, light: { ...fullProfile.light, lightBrightness: 200 }, clock }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(decodeProfile('')).toBeNull()
  })
})

describe('decodeProfile — payloads without clock', () => {
  it('returns null for a share payload without clock (clock is now required)', () => {
    const { id: _id, clock: _clock, ...rest } = fullProfile
    const result = decodeProfile(encodeURIComponent(JSON.stringify(rest)))
    expect(result).toBeNull()
  })
})
