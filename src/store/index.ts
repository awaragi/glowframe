import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Profile {
  id: string
  name: string
  lightColor: string
  brightness: number
  colorTemperature: number
  ringFormat: 'full' | 'circle' | 'border'
  innerRadius: number
  outerRadius: number
}

interface AppState {
  _version: number
  profiles: Profile[]
  activeProfileId: string
  createProfile: (name: string) => void
  renameProfile: (id: string, newName: string) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string) => void
  updateProfile: (id: string, patch: Partial<Omit<Profile, 'id'>>) => void
}

export function selectActiveProfile(state: AppState): Profile {
  return state.profiles.find((p) => p.id === state.activeProfileId) ?? state.profiles[0]
}

const _defaultProfile: Profile = {
  id: crypto.randomUUID(),
  name: 'Default',
  lightColor: '#ffffff',
  brightness: 100,
  colorTemperature: 6500,
  ringFormat: 'full',
  innerRadius: 0,
  outerRadius: 100,
}

const _profileDefaults: Omit<Profile, 'id' | 'name' | 'lightColor' | 'brightness'> = {
  colorTemperature: 6500,
  ringFormat: 'full',
  innerRadius: 0,
  outerRadius: 100,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      _version: 3,
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
          if (state.profiles.length <= 1) return state
          const idx = state.profiles.findIndex((p) => p.id === id)
          const newProfiles = state.profiles.filter((p) => p.id !== id)
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
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }))
      },
    }),
    {
      name: 'glowframe-store',
      version: 3,
      partialize: (state) => ({
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        _version: state._version,
      }),
      migrate(persisted, version) {
        if (version === 1) {
          const v1 = persisted as { lightColor?: string; brightness?: number }
          const migratedProfile: Profile = {
            id: crypto.randomUUID(),
            name: 'Default',
            lightColor: v1.lightColor ?? '#ffffff',
            brightness: v1.brightness ?? 100,
            ..._profileDefaults,
          }
          return {
            _version: 3,
            profiles: [migratedProfile],
            activeProfileId: migratedProfile.id,
          }
        }
        if (version === 2) {
          const v2 = persisted as {
            profiles: Omit<Profile, 'colorTemperature' | 'ringFormat' | 'innerRadius' | 'outerRadius'>[]
            activeProfileId: string
          }
          return {
            _version: 3,
            profiles: v2.profiles.map((p) => ({ ...p, ..._profileDefaults })),
            activeProfileId: v2.activeProfileId,
          }
        }
        return persisted as AppState
      },
    },
  ),
)
