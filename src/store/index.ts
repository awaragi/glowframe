import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MODE_DEFAULTS } from '@/lib/modeDefaults'
import type {
  ProfileMode,
  FullProfile,
  FullColorProfile,
  RingProfile,
  RingColorProfile,
  SpotProfile,
  SpotColorProfile,
} from '@/lib/modeDefaults'

export type { ProfileMode, FullProfile, FullColorProfile, RingProfile, RingColorProfile, SpotProfile, SpotColorProfile } from '@/lib/modeDefaults'

export type Profile = { id: string; name: string } & ProfileMode

// All mode-specific fields combined (mode discriminant stripped first to avoid never collapse)
type AllModeFields = Partial<
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
  renameProfile: (id: string, newName: string) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string) => void
  updateProfile: (id: string, patch: AllModeFields) => void
  switchMode: (id: string, newMode: ProfileMode['mode']) => void
}

export function selectActiveProfile(state: AppState): Profile {
  return state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]
}

const _defaultProfile: Profile = {
  id: crypto.randomUUID(),
  name: 'Default',
  ...MODE_DEFAULTS['full'],
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _version: 4,
      profiles: [_defaultProfile],
      activeProfileId: _defaultProfile.id,
      createProfile(name) {
        const active = selectActiveProfile(get())
        const newProfile: Profile = {
          ...active,
          id: crypto.randomUUID(),
          name,
        }
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          activeProfileId: newProfile.id,
        }))
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
              ...MODE_DEFAULTS['full'],
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
      updateProfile(id, patch) {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? ({ ...p, ...patch } as Profile) : p,
          ),
        }))
      },
      switchMode(id, newMode) {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? ({ id: p.id, name: p.name, ...MODE_DEFAULTS[newMode] } as Profile)
              : p,
          ),
        }))
      },
    }),
    {
      name: 'glowframe-store',
      version: 4,
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        _version: state._version,
      }),
    },
  ),
)
