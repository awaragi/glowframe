export type FullProfile = {
  mode: 'full'
  lightTemperature: number
  lightBrightness: number
}

export type FullColorProfile = {
  mode: 'full-color'
  lightColor: string
}

export type RingProfile = {
  mode: 'ring'
  lightTemperature: number
  lightBrightness: number
  innerRadius: number
  outerRadius: number
  backgroundLightTemperature: number
  backgroundLightBrightness: number
}

export type RingColorProfile = {
  mode: 'ring-color'
  lightColor: string
  innerRadius: number
  outerRadius: number
  backgroundColor: string
}

export type SpotProfile = {
  mode: 'spot'
  lightTemperature: number
  lightBrightness: number
  radius: number
  backgroundLightTemperature: number
  backgroundLightBrightness: number
}

export type SpotColorProfile = {
  mode: 'spot-color'
  lightColor: string
  radius: number
  backgroundColor: string
}

export type ProfileMode =
  | FullProfile
  | FullColorProfile
  | RingProfile
  | RingColorProfile
  | SpotProfile
  | SpotColorProfile

export const MODE_DEFAULTS = {
  'full':       { mode: 'full',       lightTemperature: 6500, lightBrightness: 100 },
  'full-color': { mode: 'full-color', lightColor: '#ffffff' },
  'ring':       { mode: 'ring',       lightTemperature: 6500, lightBrightness: 100, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 0, backgroundLightBrightness: 0 },
  'ring-color': { mode: 'ring-color', lightColor: '#ffffff', innerRadius: 20, outerRadius: 80, backgroundColor: '#000000' },
  'spot':       { mode: 'spot',       lightTemperature: 6500, lightBrightness: 100, radius: 40, backgroundLightTemperature: 0, backgroundLightBrightness: 0 },
  'spot-color': { mode: 'spot-color', lightColor: '#ffffff', radius: 40, backgroundColor: '#000000' },
} as const satisfies Record<ProfileMode['mode'], ProfileMode>
