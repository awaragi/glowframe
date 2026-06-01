import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import GlobalShortcuts from './GlobalShortcuts'
import { useAppStore, CLOCK_DEFAULTS } from '@/store'
import type { Profile } from '@/store'

function makeProfile(id: string, mode: Profile['light']['mode'] = 'full'): Profile {
  return {
    id,
    name: `Profile ${id}`,
    light: { mode, lightTemperature: 6500, lightBrightness: 100 } as Profile['light'],
    clock: { ...CLOCK_DEFAULTS },
  }
}

function fireKeydown(key: string, shiftKey = false) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
}

const defaultProps = {
  onToggleFullscreen: vi.fn(),
  onToggleSettings: vi.fn(),
  onToggleHelp: vi.fn(),
  onModeCycled: vi.fn(),
  profiles: [makeProfile('1')],
  setActiveProfile: vi.fn(),
}

function resetStore(lightMode: Profile['light']['mode'] = 'full') {
  const profile = makeProfile('p1', lightMode)
  useAppStore.setState({
    _version: 5,
    profiles: [profile],
    activeProfileId: profile.id,
  })
}

describe('GlobalShortcuts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetStore()
  })

  it('f key calls onToggleFullscreen', () => {
    const toggle = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onToggleFullscreen={toggle} />)
    fireKeydown('f')
    expect(toggle).toHaveBeenCalledOnce()
  })

  it('uppercase F key also calls onToggleFullscreen', () => {
    const toggle = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onToggleFullscreen={toggle} />)
    fireKeydown('F', true)
    expect(toggle).toHaveBeenCalledOnce()
  })

  it('s key calls onToggleSettings', () => {
    const toggleSettings = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onToggleSettings={toggleSettings} />)
    fireKeydown('s')
    expect(toggleSettings).toHaveBeenCalledOnce()
  })

  it('? key calls onToggleHelp', () => {
    const toggleHelp = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onToggleHelp={toggleHelp} />)
    fireKeydown('?', true)
    expect(toggleHelp).toHaveBeenCalledOnce()
  })

  it('1 key selects first profile', () => {
    const setActive = vi.fn()
    const profiles = [makeProfile('a'), makeProfile('b')]
    render(<GlobalShortcuts {...defaultProps} profiles={profiles} setActiveProfile={setActive} />)
    fireKeydown('1')
    expect(setActive).toHaveBeenCalledWith('a')
  })

  it('digit key is no-op when profile at that index does not exist', () => {
    const setActive = vi.fn()
    const profiles = [makeProfile('a')]
    render(<GlobalShortcuts {...defaultProps} profiles={profiles} setActiveProfile={setActive} />)
    fireKeydown('2')
    expect(setActive).not.toHaveBeenCalled()
  })

  it('9 key selects ninth profile when it exists', () => {
    const setActive = vi.fn()
    const profiles = Array.from({ length: 9 }, (_, i) => makeProfile(String(i)))
    render(<GlobalShortcuts {...defaultProps} profiles={profiles} setActiveProfile={setActive} />)
    fireKeydown('9')
    expect(setActive).toHaveBeenCalledWith('8')
  })
})

describe('GlobalShortcuts — M key mode cycling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('M advances mode from full to full-color', () => {
    resetStore('full')
    const onModeCycled = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onModeCycled={onModeCycled} />)
    fireKeydown('m')
    const light = useAppStore.getState().profiles[0].light
    expect(light.mode).toBe('full-color')
    expect(onModeCycled).toHaveBeenCalledWith('Full Color')
  })

  it('M advances mode from full-color to ring', () => {
    resetStore('full-color')
    const onModeCycled = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onModeCycled={onModeCycled} />)
    fireKeydown('m')
    expect(useAppStore.getState().profiles[0].light.mode).toBe('ring')
    expect(onModeCycled).toHaveBeenCalledWith('Ring')
  })

  it('M wraps from spot-color back to full', () => {
    resetStore('spot-color')
    const onModeCycled = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onModeCycled={onModeCycled} />)
    fireKeydown('m')
    expect(useAppStore.getState().profiles[0].light.mode).toBe('full')
    expect(onModeCycled).toHaveBeenCalledWith('Full')
  })

  it('uppercase M also cycles mode', () => {
    resetStore('full')
    const onModeCycled = vi.fn()
    render(<GlobalShortcuts {...defaultProps} onModeCycled={onModeCycled} />)
    fireKeydown('M')
    expect(useAppStore.getState().profiles[0].light.mode).toBe('full-color')
    expect(onModeCycled).toHaveBeenCalledOnce()
  })

  it('M is suppressed when an input has focus', () => {
    resetStore('full')
    const onModeCycled = vi.fn()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    render(<GlobalShortcuts {...defaultProps} onModeCycled={onModeCycled} />)
    fireKeydown('m')
    expect(useAppStore.getState().profiles[0].light.mode).toBe('full')
    expect(onModeCycled).not.toHaveBeenCalled()
    document.body.removeChild(input)
  })
})
