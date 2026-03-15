import { useAppStore, selectActiveProfile } from '@/store'

function makeProfile(overrides?: Record<string, unknown>) {
  return {
    id: crypto.randomUUID(),
    name: 'Default',
    lightColor: '#ffffff',
    brightness: 100,
    colorTemperature: 6500,
    ringFormat: 'full' as const,
    innerRadius: 0,
    outerRadius: 100,
    ...overrides,
  }
}

function resetStore(profileFields?: Parameters<typeof makeProfile>[0]) {
  const profile = makeProfile(profileFields)
  useAppStore.setState({
    _version: 3,
    profiles: [profile],
    activeProfileId: profile.id,
  })
  return profile
}

describe('useAppStore', () => {
  beforeEach(() => {
    resetStore()
  })

  it('initialises with _version 3', () => {
    expect(useAppStore.getState()._version).toBe(3)
  })

  it('initialises with a default profile named "Default"', () => {
    const state = useAppStore.getState()
    expect(state.profiles).toHaveLength(1)
    expect(state.profiles[0].name).toBe('Default')
  })

  it('initialises with default lightColor #ffffff on the default profile', () => {
    const active = selectActiveProfile(useAppStore.getState())
    expect(active.lightColor).toBe('#ffffff')
  })

  it('initialises with default brightness 100 on the default profile', () => {
    const active = selectActiveProfile(useAppStore.getState())
    expect(active.brightness).toBe(100)
  })

  it('selectActiveProfile returns the active profile', () => {
    const state = useAppStore.getState()
    const active = selectActiveProfile(state)
    expect(active.id).toBe(state.activeProfileId)
  })

  describe('createProfile', () => {
    it('clones active profile settings into the new profile', () => {
      const state = useAppStore.getState()
      const activeId = state.activeProfileId
      // Update the active profile's lightColor first
      useAppStore.setState({
        profiles: state.profiles.map((p) =>
          p.id === activeId ? { ...p, lightColor: '#ff8800', brightness: 80 } : p,
        ),
      })
      useAppStore.getState().createProfile('Warm')
      const newState = useAppStore.getState()
      const newProfile = newState.profiles.find((p) => p.name === 'Warm')
      expect(newProfile).toBeDefined()
      expect(newProfile!.lightColor).toBe('#ff8800')
      expect(newProfile!.brightness).toBe(80)
      // Extended fields should also clone
      expect(newProfile!.colorTemperature).toBe(6500)
      expect(newProfile!.ringFormat).toBe('full')
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
      // Switch active back to first profile so Extra is non-active
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
      useAppStore.getState().updateProfile(id, { brightness: 42, ringFormat: 'circle' })
      const profile = useAppStore.getState().profiles.find((p) => p.id === id)!
      expect(profile.brightness).toBe(42)
      expect(profile.ringFormat).toBe('circle')
    })

    it('does not affect other profiles', () => {
      useAppStore.getState().createProfile('B')
      const bId = useAppStore.getState().activeProfileId
      const aId = useAppStore.getState().profiles[0].id
      useAppStore.getState().updateProfile(bId, { brightness: 10 })
      const a = useAppStore.getState().profiles.find((p) => p.id === aId)!
      expect(a.brightness).toBe(100)
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

  describe('migrate', () => {
    it('converts v1 data to v3 profile shape with extended defaults', () => {
      const migrate = useAppStore.persist.getOptions().migrate!
      const result = migrate({ lightColor: '#ffcc00', brightness: 60, _version: 1 }, 1) as {
        profiles: {
          lightColor: string
          brightness: number
          name: string
          colorTemperature: number
          ringFormat: string
          innerRadius: number
          outerRadius: number
        }[]
        activeProfileId: string
        _version: number
      }
      expect(result._version).toBe(3)
      expect(result.profiles).toHaveLength(1)
      expect(result.profiles[0].lightColor).toBe('#ffcc00')
      expect(result.profiles[0].brightness).toBe(60)
      expect(result.profiles[0].name).toBe('Default')
      expect(result.profiles[0].colorTemperature).toBe(6500)
      expect(result.profiles[0].ringFormat).toBe('full')
      expect(result.profiles[0].innerRadius).toBe(0)
      expect(result.profiles[0].outerRadius).toBe(100)
    })

    it('converts v2 data to v3 by applying extended field defaults', () => {
      const migrate = useAppStore.persist.getOptions().migrate!
      const profileId = crypto.randomUUID()
      const v2Data = {
        _version: 2,
        profiles: [{ id: profileId, name: 'Test', lightColor: '#aabbcc', brightness: 75 }],
        activeProfileId: profileId,
      }
      const result = migrate(v2Data, 2) as {
        profiles: { colorTemperature: number; ringFormat: string }[]
        _version: number
      }
      expect(result._version).toBe(3)
      expect(result.profiles[0].colorTemperature).toBe(6500)
      expect(result.profiles[0].ringFormat).toBe('full')
    })
  })
})
