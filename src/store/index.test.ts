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
})
