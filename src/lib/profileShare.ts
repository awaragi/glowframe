import { z } from 'zod'
import { CLOCK_DEFAULTS } from '@/store/index'
import type { Profile } from '@/store/index'

const nameField = z.string().min(1).max(64)

export const clockConfigSchema = z.object({
  enabled: z.boolean(),
  position: z.enum(['top-left', 'bottom-left', 'bottom-right']),
  size: z.enum(['small', 'medium', 'large']),
  format: z.enum(['HH:mm', 'HH:mm:ss', 'hh:mm a', 'hh:mm:ss a']),
})

const fullSchema = z.object({
  mode: z.literal('full'),
  name: nameField,
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  clock: clockConfigSchema.optional(),
}).strict()

const fullColorSchema = z.object({
  mode: z.literal('full-color'),
  name: nameField,
  lightColor: z.string(),
  clock: clockConfigSchema.optional(),
}).strict()

const ringSchema = z.object({
  mode: z.literal('ring'),
  name: nameField,
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
  clock: clockConfigSchema.optional(),
}).strict()

const ringColorSchema = z.object({
  mode: z.literal('ring-color'),
  name: nameField,
  lightColor: z.string(),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundColor: z.string(),
  clock: clockConfigSchema.optional(),
}).strict()

const spotSchema = z.object({
  mode: z.literal('spot'),
  name: nameField,
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  radius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
  clock: clockConfigSchema.optional(),
}).strict()

const spotColorSchema = z.object({
  mode: z.literal('spot-color'),
  name: nameField,
  lightColor: z.string(),
  radius: z.number().min(0).max(100),
  backgroundColor: z.string(),
  clock: clockConfigSchema.optional(),
}).strict()

export const sharedProfileSchema = z.discriminatedUnion('mode', [
  fullSchema,
  fullColorSchema,
  ringSchema,
  ringColorSchema,
  spotSchema,
  spotColorSchema,
])

export type SharedProfile = z.infer<typeof sharedProfileSchema>

export function encodeProfile(profile: Profile): string {
  const { id: _id, ...rest } = profile
  const normalized = { ...rest, clock: rest.clock ?? CLOCK_DEFAULTS }
  return encodeURIComponent(JSON.stringify(normalized))
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
