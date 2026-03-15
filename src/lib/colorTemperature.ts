/**
 * Converts a colour temperature in Kelvin to a hex tint string.
 * Interpolates linearly between warm-white (#ffb347 at 1000 K)
 * and cool-white (#cce8ff at 10000 K).
 */
export function kelvinToHex(k: number): string {
  const clamped = Math.max(1000, Math.min(10000, k))
  const t = (clamped - 1000) / (10000 - 1000) // 0 = warm, 1 = cool

  const warm = { r: 0xff, g: 0xb3, b: 0x47 }
  const cool = { r: 0xcc, g: 0xe8, b: 0xff }

  const r = Math.round(warm.r + (cool.r - warm.r) * t)
  const g = Math.round(warm.g + (cool.g - warm.g) * t)
  const b = Math.round(warm.b + (cool.b - warm.b) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Blends a base hex color with a kelvin tint at 30% opacity.
 * Returns a hex string representing the blended colour.
 */
export function blendWithTemperature(baseHex: string, k: number): string {
  const tint = kelvinToHex(k)
  const base = hexToRgb(baseHex)
  const tintRgb = hexToRgb(tint)
  if (!base || !tintRgb) return baseHex

  const alpha = 0.3
  const r = Math.round(base.r * (1 - alpha) + tintRgb.r * alpha)
  const g = Math.round(base.g * (1 - alpha) + tintRgb.g * alpha)
  const b = Math.round(base.b * (1 - alpha) + tintRgb.b * alpha)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}
