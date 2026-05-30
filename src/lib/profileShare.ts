import { z } from 'zod'
import type { Profile } from '@/store/index'

const nameField = z.string().min(1).max(64)

export const clockConfigSchema = z.object({
  enabled: z.boolean(),
  position: z.enum(['top-left', 'bottom-left', 'bottom-right']),
  size: z.enum(['small', 'medium', 'large']),
  format: z.enum(['HH:mm', 'HH:mm:ss', 'hh:mm a', 'hh:mm:ss a']),
})

const lightFullSchema = z.object({
  mode: z.literal('full'),
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
}).strict()

const lightFullColorSchema = z.object({
  mode: z.literal('full-color'),
  lightColor: z.string(),
}).strict()

const lightRingSchema = z.object({
  mode: z.literal('ring'),
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
}).strict()

const lightRingColorSchema = z.object({
  mode: z.literal('ring-color'),
  lightColor: z.string(),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundColor: z.string(),
}).strict()

const lightSpotSchema = z.object({
  mode: z.literal('spot'),
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  radius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
}).strict()

const lightSpotColorSchema = z.object({
  mode: z.literal('spot-color'),
  lightColor: z.string(),
  radius: z.number().min(0).max(100),
  backgroundColor: z.string(),
}).strict()

const lightConfigSchema = z.discriminatedUnion('mode', [
  lightFullSchema,
  lightFullColorSchema,
  lightRingSchema,
  lightRingColorSchema,
  lightSpotSchema,
  lightSpotColorSchema,
])

export const sharedProfileSchema = z.object({
  name: nameField,
  light: lightConfigSchema,
  clock: clockConfigSchema,
}).strict()

export type SharedProfile = z.infer<typeof sharedProfileSchema>

export function encodeProfile(profile: Profile): string {
  const { id: _id, ...rest } = profile
  return encodeURIComponent(JSON.stringify(rest))
}

export function decodeProfile(param: string): SharedProfile | null {
  try {
    const json = decodeURIComponent(param)
    const parsed: unknown = JSON.parse(json)
    const result = sharedProfileSchema.safeParse(parsed)
    if (!result.success) return null
    return result.data
  } catch {
    return null
  }
}
