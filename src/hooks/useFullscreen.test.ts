import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useFullscreen } from '@/hooks/useFullscreen'

describe('useFullscreen', () => {
  let requestFullscreenMock: ReturnType<typeof vi.fn>
  let exitFullscreenMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    requestFullscreenMock = vi.fn().mockResolvedValue(undefined)
    exitFullscreenMock = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(document, 'fullscreenEnabled', {
      value: true,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(document, 'fullscreenElement', {
      value: null,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: requestFullscreenMock,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(document, 'exitFullscreen', {
      value: exitFullscreenMock,
      configurable: true,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('isAvailable is true when fullscreenEnabled is true', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isAvailable).toBe(true)
  })

  it('isAvailable is false when fullscreenEnabled is false', () => {
    Object.defineProperty(document, 'fullscreenEnabled', {
      value: false,
      configurable: true,
    })
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isAvailable).toBe(false)
  })

  it('toggle is a no-op when isAvailable is false', () => {
    Object.defineProperty(document, 'fullscreenEnabled', {
      value: false,
      configurable: true,
    })
    const { result } = renderHook(() => useFullscreen())
    expect(() => result.current.toggle()).not.toThrow()
    expect(requestFullscreenMock).not.toHaveBeenCalled()
    expect(exitFullscreenMock).not.toHaveBeenCalled()
  })

  it('toggle calls requestFullscreen when not in fullscreen', () => {
    const { result } = renderHook(() => useFullscreen())
    act(() => {
      result.current.toggle()
    })
    expect(requestFullscreenMock).toHaveBeenCalled()
  })

  it('toggle calls exitFullscreen when already in fullscreen', () => {
    Object.defineProperty(document, 'fullscreenElement', {
      value: document.documentElement,
      configurable: true,
    })
    const { result } = renderHook(() => useFullscreen())
    act(() => {
      result.current.toggle()
    })
    expect(exitFullscreenMock).toHaveBeenCalled()
  })

  it('isFullscreen updates when fullscreenchange event fires', () => {
    const { result } = renderHook(() => useFullscreen())
    expect(result.current.isFullscreen).toBe(false)

    act(() => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: document.documentElement,
        configurable: true,
      })
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    expect(result.current.isFullscreen).toBe(true)

    act(() => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        configurable: true,
      })
      document.dispatchEvent(new Event('fullscreenchange'))
    })

    expect(result.current.isFullscreen).toBe(false)
  })

  it('removes the fullscreenchange listener on unmount', () => {
    const addSpy = vi.spyOn(document, 'addEventListener')
    const removeSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => useFullscreen())

    const addedListener = addSpy.mock.calls.find(
      (c) => c[0] === 'fullscreenchange',
    )?.[1]
    expect(addedListener).toBeDefined()

    unmount()

    const removedListener = removeSpy.mock.calls.find(
      (c) => c[0] === 'fullscreenchange',
    )?.[1]
    expect(removedListener).toBe(addedListener)
  })

  it('toggle swallows errors from requestFullscreen silently', async () => {
    requestFullscreenMock.mockRejectedValue(new Error('not allowed'))
    const { result } = renderHook(() => useFullscreen())
    await expect(
      act(() => {
        result.current.toggle()
      }),
    ).resolves.not.toThrow()
  })

  it('toggle swallows errors from exitFullscreen silently', async () => {
    exitFullscreenMock.mockRejectedValue(new Error('not allowed'))
    Object.defineProperty(document, 'fullscreenElement', {
      value: document.documentElement,
      configurable: true,
    })
    const { result } = renderHook(() => useFullscreen())
    await expect(
      act(() => {
        result.current.toggle()
      }),
    ).resolves.not.toThrow()
  })
})
