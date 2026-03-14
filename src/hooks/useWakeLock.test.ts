import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWakeLock } from '@/hooks/useWakeLock'

function makeSentinel() {
  return {
    release: vi.fn().mockResolvedValue(undefined),
    type: 'screen' as const,
    released: false,
    onrelease: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

describe('useWakeLock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('requests a screen wake lock on mount when API is available', async () => {
    const sentinel = makeSentinel()
    const requestMock = vi.fn().mockResolvedValue(sentinel)
    vi.stubGlobal('navigator', { wakeLock: { request: requestMock } })

    renderHook(() => useWakeLock())
    await vi.runAllTimersAsync()

    expect(requestMock).toHaveBeenCalledWith('screen')
  })

  it('releases the wake lock on unmount', async () => {
    const sentinel = makeSentinel()
    const requestMock = vi.fn().mockResolvedValue(sentinel)
    vi.stubGlobal('navigator', { wakeLock: { request: requestMock } })

    const { unmount } = renderHook(() => useWakeLock())
    await vi.runAllTimersAsync()

    unmount()
    await vi.runAllTimersAsync()

    expect(sentinel.release).toHaveBeenCalled()
  })

  it('re-requests wake lock when visibility changes to visible after hidden', async () => {
    const sentinel = makeSentinel()
    const requestMock = vi.fn().mockResolvedValue(sentinel)
    vi.stubGlobal('navigator', { wakeLock: { request: requestMock } })

    renderHook(() => useWakeLock())
    await vi.runAllTimersAsync()

    // Simulate hidden
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.runAllTimersAsync()

    expect(sentinel.release).toHaveBeenCalled()

    // Simulate visible again
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.runAllTimersAsync()

    expect(requestMock).toHaveBeenCalledTimes(2)
  })

  it('does not throw when navigator.wakeLock is undefined', () => {
    vi.stubGlobal('navigator', {})

    expect(() => renderHook(() => useWakeLock())).not.toThrow()
  })

  it('does not throw when navigator.wakeLock.request rejects', async () => {
    const requestMock = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { wakeLock: { request: requestMock } })

    renderHook(() => useWakeLock())
    await expect(vi.runAllTimersAsync()).resolves.not.toThrow()
  })
})
