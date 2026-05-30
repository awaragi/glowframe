import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'
import { MODE_DEFAULTS } from '@/lib/modeDefaults'
import type { ClockFormat } from '@/lib/clockFormat'
import type {
  LightConfig,
  FullProfile,
  FullColorProfile,
  RingProfile,
  RingColorProfile,
  SpotProfile,
  SpotColorProfile,
} from '@/lib/modeDefaults'
import type { BackupProfile } from '@/lib/profileBackup'

export type { LightConfig, FullProfile, FullColorProfile, RingProfile, RingColorProfile, SpotProfile, SpotColorProfile } from '@/lib/modeDefaults'
export type { ClockFormat } from '@/lib/clockFormat'

export interface ClockConfig {
  enabled: boolean
  position: 'top-left' | 'bottom-left' | 'bottom-right'
  size: 'small' | 'medium' | 'large'
  format: ClockFormat
}

export const CLOCK_DEFAULTS: ClockConfig = {
  enabled: true,
  position: 'bottom-left',
  size: 'medium',
  format: 'HH:mm',
}

export type Profile = { id: string; name: string; light: LightConfig; clock: ClockConfig }

// All light-specific fields combined (mode discriminant stripped first to avoid never collapse)
type AllLightFields = Partial<
  Omit<FullProfile, 'mode'> &
  Omit<FullColorProfile, 'mode'> &
  Omit<RingProfile, 'mode'> &
  Omit<RingColorProfile, 'mode'> &
  Omit<SpotProfile, 'mode'> &
  Omit<SpotColorProfile, 'mode'>
>

interface AppState {
  _version: number
  profiles: Profile[]
  activeProfileId: string
  createProfile: (name: string) => void
  importProfile: (data: Omit<Profile, 'id'>) => string
  renameProfile: (id: string, newName: string) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string) => void
  updateLight: (id: string, patch: AllLightFields) => void
  updateClock: (id: string, patch: Partial<ClockConfig>) => void
  switchMode: (id: string, newMode: LightConfig['mode']) => void
  reorderProfiles: (fromIndex: number, toIndex: number) => void
  restoreProfiles: (profiles: BackupProfile[]) => void
}

export function selectActiveProfile(state: AppState): Profile {
  return state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]
}

const _defaultProfile: Profile = {
  id: crypto.randomUUID(),
  name: 'Default',
  light: { ...MODE_DEFAULTS['full'] },
  clock: { ...CLOCK_DEFAULTS },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _version: 5,
      profiles: [_defaultProfile],
      activeProfileId: _defaultProfile.id,
      createProfile(name) {
        const active = selectActiveProfile(get())
        const newProfile: Profile = {
          id: crypto.randomUUID(),
          name,
          light: { ...active.light },
          clock: { ...active.clock },
        }
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }))
      },
      importProfile(data) {
        const id = crypto.randomUUID()
        const newProfile = { ...data, id }
        set((state) => ({ profiles: [...state.profiles, newProfile] }))
        return id
      },
      renameProfile(id, newName) {
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, name: newName } : p)),
        }))
      },
      deleteProfile(id) {
        set((state) => {
          const newProfiles = state.profiles.filter((p) => p.id !== id)
          if (newProfiles.length === 0) {
            const fresh: Profile = {
              id: crypto.randomUUID(),
              name: 'Default',
              light: { ...MODE_DEFAULTS['full'] },
              clock: { ...CLOCK_DEFAULTS },
            }
            return { profiles: [fresh], activeProfileId: fresh.id }
          }
          const idx = state.profiles.findIndex((p) => p.id === id)
          let newActiveId = state.activeProfileId
          if (state.activeProfileId === id) {
            const prevIdx = Math.max(0, idx - 1)
            newActiveId = newProfiles[prevIdx].id
          }
          return { profiles: newProfiles, activeProfileId: newActiveId }
        })
      },
      setActiveProfile(id) {
        set({ activeProfileId: id })
      },
      updateLight(id, patch) {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? { ...p, light: { ...p.light, ...patch } as LightConfig }
              : p,
          ),
        }))
      },
      updateClock(id, patch) {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? { ...p, clock: { ...p.clock, ...patch } }
              : p,
          ),
        }))
      },
      switchMode(id, newMode) {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? { id: p.id, name: p.name, light: { ...MODE_DEFAULTS[newMode] }, clock: p.clock }
              : p,
          ),
        }))
      },
      reorderProfiles(fromIndex, toIndex) {
        set((state) => ({
          profiles: arrayMove(state.profiles, fromIndex, toIndex),
        }))
      },
      restoreProfiles(backupProfiles) {
        const restored: Profile[] = backupProfiles.map((entry) => ({
          id: crypto.randomUUID(),
          name: entry.name,
          light: entry.light,
          clock: entry.clock,
        }))
        set({
          profiles: restored,
          activeProfileId: restored[0].id,
        })
      },
    }),
    {
      name: 'glowframe-store',
      version: 5,
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        _version: state._version,
      }),
    },
  ),
)
