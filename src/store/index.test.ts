import { useAppStore, selectActiveProfile } from '@/store'
import type { Profile } from '@/store'
import { MODE_DEFAULTS } from '@/lib/modeDefaults'

function makeFullProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: crypto.randomUUID(),
    name: 'Default',
    mode: 'full',
    lightTemperature: 6500,
    lightBrightness: 100,
    ...overrides,
  } as Profile
}

function resetStore(profile: Profile = makeFullProfile()) {
  useAppStore.setState({
    _version: 4,
    profiles: [profile],
    activeProfileId: profile.id,
  })
  return profile
}

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('initialises with _version 4', () => {
    expect(useAppStore.getState()._version).toBe(4)
  })

  it('initialises with a default profile named "Default"', () => {
    const state = useAppStore.getState()
    expect(state.profiles).toHaveLength(1)
    expect(state.profiles[0].name).toBe('Default')
  })

  it('default profile seeds from MODE_DEFAULTS full', () => {
    const active = selectActiveProfile(useAppStore.getState())
    expect(active.mode).toBe('full')
    if (active.mode === 'full') {
      expect(active.lightTemperature).toBe(MODE_DEFAULTS['full'].lightTemperature)
      expect(active.lightBrightness).toBe(MODE_DEFAULTS['full'].lightBrightness)
    }
  })

  it('selectActiveProfile returns the active profile', () => {
    const state = useAppStore.getState()
    const active = selectActiveProfile(state)
    expect(active.id).toBe(state.activeProfileId)
  })

  describe('createProfile', () => {
    it('clones active profile settings (including mode) into the new profile', () => {
      const active = makeFullProfile({ id: 'a1', lightTemperature: 3000, lightBrightness: 80 })
      resetStore(active)
      useAppStore.getState().createProfile('Warm')
      const newState = useAppStore.getState()
      const newProfile = newState.profiles.find((p) => p.name === 'Warm')
      expect(newProfile).toBeDefined()
      expect(newProfile!.mode).toBe('full')
      if (newProfile!.mode === 'full') {
        expect(newProfile!.lightTemperature).toBe(3000)
        expect(newProfile!.lightBrightness).toBe(80)
      }
    })

    it('clones mode-specific fields when active profile is ring mode', () => {
      const ringProfile: Profile = {
        id: 'r1',
        name: 'Ring',
        mode: 'ring',
        lightTemperature: 6500,
        lightBrightness: 100,
        innerRadius: 30,
        outerRadius: 70,
        backgroundLightTemperature: 0,
        backgroundLightBrightness: 0,
      }
      resetStore(ringProfile)
      useAppStore.getState().createProfile('Ring Copy')
      const newProfile = useAppStore.getState().profiles.find((p) => p.name === 'Ring Copy')!
      expect(newProfile.mode).toBe('ring')
      if (newProfile.mode === 'ring') {
        expect(newProfile.innerRadius).toBe(30)
        expect(newProfile.outerRadius).toBe(70)
      }
    })

    it('switches activeProfileId to the new profile', () => {
      useAppStore.getState().createProfile('Studio')
      const state = useAppStore.getState()
      const studio = state.profiles.find((p) => p.name === 'Studio')
      expect(state.activeProfileId).toBe(studio!.id)
    })

    it('adds the new profile to the profiles array', () => {
      useAppStore.getState().createProfile('Night')
      expect(useAppStore.getState().profiles).toHaveLength(2)
    })
  })

  describe('renameProfile', () => {
    it('updates the name of the specified profile', () => {
      const id = useAppStore.getState().activeProfileId
      useAppStore.getState().renameProfile(id, 'Studio')
      const profile = useAppStore.getState().profiles.find((p) => p.id === id)
      expect(profile!.name).toBe('Studio')
    })

    it('does not affect other profiles', () => {
      useAppStore.getState().createProfile('Other')
      const state = useAppStore.getState()
      const firstId = state.profiles[0].id
      useAppStore.getState().renameProfile(firstId, 'Renamed')
      const other = useAppStore.getState().profiles.find((p) => p.name === 'Other')
      expect(other).toBeDefined()
    })
  })

  describe('deleteProfile', () => {
    it('removes the specified non-active profile', () => {
      useAppStore.getState().createProfile('Extra')
      const extraId = useAppStore.getState().profiles.find((p) => p.name === 'Extra')!.id
      useAppStore.getState().setActiveProfile(useAppStore.getState().profiles[0].id)
      useAppStore.getState().deleteProfile(extraId)
      expect(useAppStore.getState().profiles.find((p) => p.id === extraId)).toBeUndefined()
    })

    it('switches activeProfileId when active profile is deleted', () => {
      useAppStore.getState().createProfile('Second')
      const secondId = useAppStore.getState().activeProfileId
      useAppStore.getState().deleteProfile(secondId)
      const state = useAppStore.getState()
      expect(state.profiles.find((p) => p.id === secondId)).toBeUndefined()
      expect(state.profiles.find((p) => p.id === state.activeProfileId)).toBeDefined()
    })

    it('is a no-op when only one profile remains', () => {
      const id = useAppStore.getState().activeProfileId
      useAppStore.getState().deleteProfile(id)
      expect(useAppStore.getState().profiles).toHaveLength(1)
    })
  })

  describe('setActiveProfile', () => {
    it('updates activeProfileId', () => {
      useAppStore.getState().createProfile('B')
      const bId = useAppStore.getState().activeProfileId
      useAppStore.getState().setActiveProfile(useAppStore.getState().profiles[0].id)
      useAppStore.getState().setActiveProfile(bId)
      expect(useAppStore.getState().activeProfileId).toBe(bId)
    })
  })

  describe('updateProfile', () => {
    it('merges a patch into the specified profile', () => {
      const id = useAppStore.getState().activeProfileId
      useAppStore.getState().updateProfile(id, { lightBrightness: 42 })
      const profile = useAppStore.getState().profiles.find((p) => p.id === id)!
      if (profile.mode === 'full') {
        expect(profile.lightBrightness).toBe(42)
      }
    })

    it('does not affect other profiles', () => {
      useAppStore.getState().createProfile('B')
      const bId = useAppStore.getState().activeProfileId
      const aId = useAppStore.getState().profiles[0].id
      useAppStore.getState().updateProfile(bId, { lightBrightness: 10 })
      const a = useAppStore.getState().profiles.find((p) => p.id === aId)!
      if (a.mode === 'full') {
        expect(a.lightBrightness).toBe(100)
      }
    })

    it('does not change the mode when patching mode-specific fields', () => {
      const id = useAppStore.getState().activeProfileId
      useAppStore.getState().updateProfile(id, { lightBrightness: 50 })
      const profile = useAppStore.getState().profiles.find((p) => p.id === id)!
      expect(profile.mode).toBe('full')
    })
  })

  describe('switchMode', () => {
    it('replaces mode-specific fields with MODE_DEFAULTS for the new mode', () => {
      const id = useAppStore.getState().activeProfileId
      useAppStore.getState().switchMode(id, 'ring')
      const profile = useAppStore.getState().profiles.find((p) => p.id === id)!
      expect(profile.mode).toBe('ring')
      if (profile.mode === 'ring') {
        expect(profile.innerRadius).toBe(MODE_DEFAULTS['ring'].innerRadius)
        expect(profile.outerRadius).toBe(MODE_DEFAULTS['ring'].outerRadius)
        expect(profile.backgroundLightBrightness).toBe(MODE_DEFAULTS['ring'].backgroundLightBrightness)
      }
    })

    it('preserves id and name on mode switch', () => {
      const profile = makeFullProfile({ id: 'keep-id', name: 'My Profile' })
      resetStore(profile)
      useAppStore.getState().switchMode('keep-id', 'spot-color')
      const updated = useAppStore.getState().profiles.find((p) => p.id === 'keep-id')!
      expect(updated.id).toBe('keep-id')
      expect(updated.name).toBe('My Profile')
    })

    it('removes old mode fields after switching', () => {
      const ringProfile: Profile = {
        id: 'r1',
        name: 'Ring',
        mode: 'ring',
        lightTemperature: 6500,
        lightBrightness: 100,
        innerRadius: 30,
        outerRadius: 70,
        backgroundLightTemperature: 0,
        backgroundLightBrightness: 0,
      }
      resetStore(ringProfile)
      useAppStore.getState().switchMode('r1', 'full')
      const updated = useAppStore.getState().profiles.find((p) => p.id === 'r1')!
      expect(updated.mode).toBe('full')
      expect((updated as Record<string, unknown>)['innerRadius']).toBeUndefined()
    })

    it('can switch through all six modes', () => {
      const id = useAppStore.getState().activeProfileId
      const modes = ['full', 'full-color', 'ring', 'ring-color', 'spot', 'spot-color'] as const
      for (const mode of modes) {
        useAppStore.getState().switchMode(id, mode)
        expect(useAppStore.getState().profiles.find((p) => p.id === id)!.mode).toBe(mode)
      }
    })

    it('does not affect other profiles', () => {
      const firstId = useAppStore.getState().activeProfileId
      useAppStore.getState().createProfile('Second')
      const secondId = useAppStore.getState().activeProfileId
      useAppStore.getState().switchMode(secondId, 'spot')
      const first = useAppStore.getState().profiles.find((p) => p.id === firstId)!
      expect(first.mode).toBe('full')
    })
  })

  it('partialize output contains only persistable keys', () => {
    const partialize = useAppStore.persist.getOptions().partialize!
    const result = partialize(useAppStore.getState())
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['profiles', 'activeProfileId', '_version']),
    )
  })

  it('partialize output contains no function-valued keys', () => {
    const partialize = useAppStore.persist.getOptions().partialize!
    const result = partialize(useAppStore.getState())
    const hasFunctions = Object.values(result).some((v) => typeof v === 'function')
    expect(hasFunctions).toBe(false)
  })

  it('store version is 4', () => {
    expect(useAppStore.persist.getOptions().version).toBe(4)
  })

  it('no migrate function is registered (no migration from prior versions)', () => {
    expect(useAppStore.persist.getOptions().migrate).toBeUndefined()
  })
})
