import { z } from 'zod'
import type { Profile } from '@/store/index'

const nameField = z.string().min(1).max(64)

const fullSchema = z.object({
  mode: z.literal('full'),
  name: nameField,
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
}).strict()

const fullColorSchema = z.object({
  mode: z.literal('full-color'),
  name: nameField,
  lightColor: z.string(),
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
}).strict()

const ringColorSchema = z.object({
  mode: z.literal('ring-color'),
  name: nameField,
  lightColor: z.string(),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundColor: z.string(),
}).strict()

const spotSchema = z.object({
  mode: z.literal('spot'),
  name: nameField,
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  radius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
}).strict()

const spotColorSchema = z.object({
  mode: z.literal('spot-color'),
  name: nameField,
  lightColor: z.string(),
  radius: z.number().min(0).max(100),
  backgroundColor: z.string(),
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
