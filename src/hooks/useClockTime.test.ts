import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClockTime } from './useClockTime'

describe('useClockTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a formatted time string immediately', () => {
    const { result } = renderHook(() => useClockTime('HH:mm'))
    expect(result.current).toBe('14:30')
  })

  it('updates the displayed time after 1 second', () => {
    vi.setSystemTime(new Date(2026, 0, 1, 14, 30, 0))
    const { result } = renderHook(() => useClockTime('HH:mm:ss'))
    expect(result.current).toBe('14:30:00')
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('14:30:01')
  })

  it('clears the interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { unmount } = renderHook(() => useClockTime('HH:mm'))
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
