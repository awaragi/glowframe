import { describe, it, expect } from 'vitest'
import { encodeProfile, decodeProfile } from './profileShare'
import type { Profile } from '@/store/index'

const fullProfile: Profile = {
  id: 'test-id-1',
  name: 'Test Full',
  mode: 'full',
  lightTemperature: 6500,
  lightBrightness: 80,
}

const fullColorProfile: Profile = {
  id: 'test-id-2',
  name: 'Test Full Color',
  mode: 'full-color',
  lightColor: '#ff8800',
}

const ringProfile: Profile = {
  id: 'test-id-3',
  name: 'Test Ring',
  mode: 'ring',
  lightTemperature: 5000,
  lightBrightness: 70,
  innerRadius: 20,
  outerRadius: 80,
  backgroundLightTemperature: 3000,
  backgroundLightBrightness: 30,
}

const ringColorProfile: Profile = {
  id: 'test-id-4',
  name: 'Test Ring Color',
  mode: 'ring-color',
  lightColor: '#ffffff',
  innerRadius: 15,
  outerRadius: 75,
  backgroundColor: '#000000',
}

const spotProfile: Profile = {
  id: 'test-id-5',
  name: 'Test Spot',
  mode: 'spot',
  lightTemperature: 4000,
  lightBrightness: 60,
  radius: 40,
  backgroundLightTemperature: 2000,
  backgroundLightBrightness: 20,
}

const spotColorProfile: Profile = {
  id: 'test-id-6',
  name: 'Test Spot Color',
  mode: 'spot-color',
  lightColor: '#aabbcc',
  radius: 35,
  backgroundColor: '#111111',
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
    it(`round-trips ${profile.mode} profile`, () => {
      const encoded = encodeProfile(profile)
      const result = decodeProfile(encoded)
      expect(result).not.toBeNull()
      expect(result!.mode).toBe(profile.mode)
      expect(result!.name).toBe(profile.name)
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

  it('returns null when mode discriminant is missing', () => {
    const obj = { name: 'Test', lightTemperature: 6500, lightBrightness: 100 }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when mode discriminant is unknown', () => {
    const obj = { mode: 'unknown-mode', name: 'Test' }
    expect(decodeProfile(encodeURIComponent(JSON.stringify(obj)))).toBeNull()
  })

  it('returns null when lightTemperature is out of range (too low)', () => {
    const obj = { ...fullProfile, lightTemperature: 500 }
    const { id: _id, ...rest } = obj
    expect(decodeProfile(encodeURIComponent(JSON.stringify(rest)))).toBeNull()
  })

  it('returns null when lightTemperature is out of range (too high)', () => {
    const obj = { ...fullProfile, lightTemperature: 99999 }
    const { id: _id, ...rest } = obj
    expect(decodeProfile(encodeURIComponent(JSON.stringify(rest)))).toBeNull()
  })

  it('returns null when lightBrightness is out of range', () => {
    const obj = { ...fullProfile, lightBrightness: 200 }
    const { id: _id, ...rest } = obj
    expect(decodeProfile(encodeURIComponent(JSON.stringify(rest)))).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(decodeProfile('')).toBeNull()
  })
})
