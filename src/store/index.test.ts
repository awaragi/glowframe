import { useAppStore } from '@/store'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ lightColor: '#ffffff', brightness: 100 })
  })

  it('initialises with _version 1', () => {
    expect(useAppStore.getState()._version).toBe(1)
  })

  it('initialises with default lightColor #ffffff', () => {
    expect(useAppStore.getState().lightColor).toBe('#ffffff')
  })

  it('initialises with default brightness 100', () => {
    expect(useAppStore.getState().brightness).toBe(100)
  })

  it('setLightColor updates lightColor', () => {
    useAppStore.getState().setLightColor('#ff0000')
    expect(useAppStore.getState().lightColor).toBe('#ff0000')
  })

  it('setBrightness updates brightness', () => {
    useAppStore.getState().setBrightness(50)
    expect(useAppStore.getState().brightness).toBe(50)
  })

  it('partialize output contains only persistable keys', () => {
    const persist = useAppStore.persist
    const partialize = persist.getOptions().partialize
    expect(partialize).toBeDefined()
    const result = partialize!(useAppStore.getState())
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining(['lightColor', 'brightness', '_version']),
    )
  })

  it('partialize output contains no function-valued keys', () => {
    const persist = useAppStore.persist
    const partialize = persist.getOptions().partialize
    const result = partialize!(useAppStore.getState())
    const hasFunctions = Object.values(result).some(
      (v) => typeof v === 'function',
    )
    expect(hasFunctions).toBe(false)
  })

  it('hydrates stored values from localStorage', async () => {
    localStorage.setItem(
      'glowframe-store',
      JSON.stringify({
        state: { lightColor: '#ff8800', brightness: 75, _version: 1 },
        version: 1,
      }),
    )
    await useAppStore.persist.rehydrate()
    expect(useAppStore.getState().lightColor).toBe('#ff8800')
    expect(useAppStore.getState().brightness).toBe(75)
  })
})
