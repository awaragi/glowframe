import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FullscreenButton from './FullscreenButton'
import * as useFullscreenModule from '@/hooks/useFullscreen'

describe('FullscreenButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders nothing when isAvailable is false', () => {
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: false,
      isAvailable: false,
      toggle: vi.fn(),
    })
    const { container } = render(<FullscreenButton />)
    expect(container.firstChild).toBeNull()
  })

  it('renders Enter fullscreen button when not in fullscreen', () => {
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: false,
      isAvailable: true,
      toggle: vi.fn(),
    })
    render(<FullscreenButton />)
    expect(
      screen.getByRole('button', { name: 'Enter fullscreen' }),
    ).toBeInTheDocument()
  })

  it('renders Exit fullscreen button when in fullscreen', () => {
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: true,
      isAvailable: true,
      toggle: vi.fn(),
    })
    render(<FullscreenButton />)
    expect(
      screen.getByRole('button', { name: 'Exit fullscreen' }),
    ).toBeInTheDocument()
  })

  it('calls toggle when the button is clicked', async () => {
    const toggle = vi.fn()
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: false,
      isAvailable: true,
      toggle,
    })
    const user = userEvent.setup()
    render(<FullscreenButton />)
    await user.click(screen.getByRole('button', { name: 'Enter fullscreen' }))
    expect(toggle).toHaveBeenCalledTimes(1)
  })

  it('shows Maximize2 icon when not in fullscreen', () => {
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: false,
      isAvailable: true,
      toggle: vi.fn(),
    })
    render(<FullscreenButton />)
    // Lucide renders an svg; aria-label distinguishes the state
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeInTheDocument()
  })

  it('shows Minimize2 icon when in fullscreen', () => {
    vi.spyOn(useFullscreenModule, 'useFullscreen').mockReturnValue({
      isFullscreen: true,
      isAvailable: true,
      toggle: vi.fn(),
    })
    render(<FullscreenButton />)
    expect(screen.getByRole('button', { name: 'Exit fullscreen' })).toBeInTheDocument()
  })
})
