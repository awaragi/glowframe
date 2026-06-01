import type { LightConfig } from '@/lib/modeDefaults'

export const MODE_CYCLE_ORDER: LightConfig['mode'][] = [
  'full',
  'full-color',
  'ring',
  'ring-color',
  'spot',
  'spot-color',
]

export const MODE_LABELS: Record<LightConfig['mode'], string> = {
  'full': 'Full',
  'full-color': 'Full Color',
  'ring': 'Ring',
  'ring-color': 'Ring Color',
  'spot': 'Spot',
  'spot-color': 'Spot Color',
}

export const MODE_OVERLAY_DURATION_MS = 1750

export function nextMode(current: LightConfig['mode']): LightConfig['mode'] {
  const idx = MODE_CYCLE_ORDER.indexOf(current)
  return MODE_CYCLE_ORDER[(idx + 1) % MODE_CYCLE_ORDER.length]
}
