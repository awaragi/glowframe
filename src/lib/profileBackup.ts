import { z } from 'zod'
import type { Profile } from '@/store/index'
import { sharedProfileSchema } from '@/lib/profileShare'

export const backupProfileSchema = sharedProfileSchema

export const backupPayloadSchema = z.object({
  version: z.literal(1),
  profiles: z.array(backupProfileSchema).min(1),
})

export type BackupProfile = z.infer<typeof backupProfileSchema>
export type BackupPayload = z.infer<typeof backupPayloadSchema>

export function exportBackup(profiles: Profile[]): string {
  const transferable: BackupProfile[] = profiles.map(({ id: _id, ...rest }) => rest as BackupProfile)
  const payload: BackupPayload = { version: 1, profiles: transferable }
  return JSON.stringify(payload, null, 2)
}

export function importBackup(json: string): BackupPayload | null {
  try {
    const parsed: unknown = JSON.parse(json)
    const result = backupPayloadSchema.safeParse(parsed)
    if (!result.success) return null
    return result.data
  } catch {
    return null
  }
}
