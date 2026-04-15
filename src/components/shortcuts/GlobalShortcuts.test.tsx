import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import GlobalShortcuts from './GlobalShortcuts'
import type { Profile } from '@/store'

function makeProfile(id: string): Profile {
  return { id, name: `Profile ${id}`, mode: 'full', lightTemperature: 6500, lightBrightness: 100 }
}

function fireKeydown(key: string, shiftKey = false) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
}

describe('GlobalShortcuts', () => {
  it('f key calls onToggleFullscreen', () => {
    const toggle = vi.fn()
    render(
      <GlobalShortcuts
        onToggleFullscreen={toggle}
        onToggleSettings={vi.fn()}
        onToggleHelp={vi.fn()}
        profiles={[makeProfile('1')]}
        setActiveProfile={vi.fn()}
      />
    )
    fireKeydown('f')
    expect(toggle).toHaveBeenCalledOnce()
  })

  it('uppercase F key also calls onToggleFullscreen', () => {
    const toggle = vi.fn()
    render(
      <GlobalShortcuts
        onToggleFullscreen={toggle}
        onToggleSettings={vi.fn()}
        onToggleHelp={vi.fn()}
        profiles={[makeProfile('1')]}
        setActiveProfile={vi.fn()}
      />
    )
    fireKeydown('F', true)
    expect(toggle).toHaveBeenCalledOnce()
  })

  it('s key calls onToggleSettings', () => {
    const toggleSettings = vi.fn()
    render(
      <GlobalShortcuts
        onToggleFullscreen={vi.fn()}
        onToggleSettings={toggleSettings}
        onToggleHelp={vi.fn()}
        profiles={[makeProfile('1')]}
        setActiveProfile={vi.fn()}
      />
    )
    fireKeydown('s')
    expect(toggleSettings).toHaveBeenCalledOnce()
  })

  it('? key calls onToggleHelp', () => {
    const toggleHelp = vi.fn()
    render(
      <GlobalShortcuts
        onToggleFullscreen={vi.fn()}
        onToggleSettings={vi.fn()}
        onToggleHelp={toggleHelp}
        profiles={[makeProfile('1')]}
        setActiveProfile={vi.fn()}
      />
    )
    fireKeydown('?', true)
    expect(toggleHelp).toHaveBeenCalledOnce()
  })

  it('1 key selects first profile', () => {
    const setActive = vi.fn()
    const profiles = [makeProfile('a'), makeProfile('b')]
    render(
      <GlobalShortcuts
        onToggleFullscreen={vi.fn()}
        onToggleSettings={vi.fn()}
        onToggleHelp={vi.fn()}
        profiles={profiles}
        setActiveProfile={setActive}
      />
    )
    fireKeydown('1')
    expect(setActive).toHaveBeenCalledWith('a')
  })

  it('digit key is no-op when profile at that index does not exist', () => {
    const setActive = vi.fn()
    const profiles = [makeProfile('a')]
    render(
      <GlobalShortcuts
        onToggleFullscreen={vi.fn()}
        onToggleSettings={vi.fn()}
        onToggleHelp={vi.fn()}
        profiles={profiles}
        setActiveProfile={setActive}
      />
    )
    fireKeydown('2') // no second profile
    expect(setActive).not.toHaveBeenCalled()
  })

  it('9 key selects ninth profile when it exists', () => {
    const setActive = vi.fn()
    const profiles = Array.from({ length: 9 }, (_, i) => makeProfile(String(i)))
    render(
      <GlobalShortcuts
        onToggleFullscreen={vi.fn()}
        onToggleSettings={vi.fn()}
        onToggleHelp={vi.fn()}
        profiles={profiles}
        setActiveProfile={setActive}
      />
    )
    fireKeydown('9')
    expect(setActive).toHaveBeenCalledWith('8') // id of 9th profile
  })
})
