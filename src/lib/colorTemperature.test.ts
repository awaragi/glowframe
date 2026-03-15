import { kelvinToHex, blendWithTemperature } from './colorTemperature'

describe('kelvinToHex', () => {
  it('returns the warm-white tint at 1000 K', () => {
    expect(kelvinToHex(1000)).toBe('#ffb347')
  })

  it('returns the cool-white tint at 10000 K', () => {
    expect(kelvinToHex(10000)).toBe('#cce8ff')
  })

  it('returns a mid-range value at 5500 K', () => {
    const result = kelvinToHex(5500)
    // Should be between warm and cool — parse the hex and check channels
    const r = parseInt(result.slice(1, 3), 16)
    const g = parseInt(result.slice(3, 5), 16)
    const b = parseInt(result.slice(5, 7), 16)
    expect(r).toBeGreaterThan(0xcc) // between 0xcc and 0xff
    expect(r).toBeLessThan(0xff)
    expect(b).toBeGreaterThan(0x47) // between 0x47 and 0xff
    expect(b).toBeLessThan(0xff)
    expect(g).toBeGreaterThan(0xb3)
  })

  it('clamps values below 1000 K to 1000 K', () => {
    expect(kelvinToHex(500)).toBe(kelvinToHex(1000))
  })

  it('clamps values above 10000 K to 10000 K', () => {
    expect(kelvinToHex(15000)).toBe(kelvinToHex(10000))
  })

  it('returns a valid 7-character hex string', () => {
    expect(kelvinToHex(6500)).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('blendWithTemperature', () => {
  it('returns a valid hex string', () => {
    expect(blendWithTemperature('#ffffff', 6500)).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('white at 6500 K is slightly tinted (not pure white)', () => {
    const result = blendWithTemperature('#ffffff', 6500)
    // Cool-white tint at 6500 K blended 30% — result differs from #ffffff
    expect(result).not.toBe('#ffffff')
  })

  it('returns the base color unchanged for an invalid hex', () => {
    expect(blendWithTemperature('invalid', 6500)).toBe('invalid')
  })
})
