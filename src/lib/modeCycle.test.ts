import { describe, expect, it } from 'vitest'
import { MODE_CYCLE_ORDER, MODE_LABELS, MODE_OVERLAY_DURATION_MS, nextMode } from './modeCycle'

describe('MODE_CYCLE_ORDER', () => {
  it('contains all six modes', () => {
    expect(MODE_CYCLE_ORDER).toEqual([
      'full',
      'full-color',
      'ring',
      'ring-color',
      'spot',
      'spot-color',
    ])
  })
})

describe('MODE_LABELS', () => {
  it('provides human-readable name for each mode', () => {
    expect(MODE_LABELS['full']).toBe('Full')
    expect(MODE_LABELS['full-color']).toBe('Full Color')
    expect(MODE_LABELS['ring']).toBe('Ring')
    expect(MODE_LABELS['ring-color']).toBe('Ring Color')
    expect(MODE_LABELS['spot']).toBe('Spot')
    expect(MODE_LABELS['spot-color']).toBe('Spot Color')
  })
})

describe('MODE_OVERLAY_DURATION_MS', () => {
  it('is a positive number within the expected range', () => {
    expect(MODE_OVERLAY_DURATION_MS).toBeGreaterThanOrEqual(1500)
    expect(MODE_OVERLAY_DURATION_MS).toBeLessThanOrEqual(2000)
  })
})

describe('nextMode', () => {
  it('advances full → full-color', () => {
    expect(nextMode('full')).toBe('full-color')
  })

  it('advances full-color → ring', () => {
    expect(nextMode('full-color')).toBe('ring')
  })

  it('advances ring → ring-color', () => {
    expect(nextMode('ring')).toBe('ring-color')
  })

  it('advances ring-color → spot', () => {
    expect(nextMode('ring-color')).toBe('spot')
  })

  it('advances spot → spot-color', () => {
    expect(nextMode('spot')).toBe('spot-color')
  })

  it('wraps spot-color → full', () => {
    expect(nextMode('spot-color')).toBe('full')
  })

  it('covers all modes in order', () => {
    let mode = MODE_CYCLE_ORDER[0]
    for (let i = 1; i < MODE_CYCLE_ORDER.length; i++) {
      mode = nextMode(mode)
      expect(mode).toBe(MODE_CYCLE_ORDER[i])
    }
    expect(nextMode(mode)).toBe(MODE_CYCLE_ORDER[0])
  })
})
