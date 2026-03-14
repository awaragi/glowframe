import { useAppStore } from '@/store'

describe('useAppStore', () => {
  it('initialises with _version 1', () => {
    expect(useAppStore.getState()._version).toBe(1)
  })
})
