import { describe, it, expect } from 'vitest'
import { formatTime } from './clockFormat'

describe('formatTime', () => {
  it("HH:mm formats midnight as '00:05'", () => {
    expect(formatTime(new Date(2026, 0, 1, 0, 5, 9), 'HH:mm')).toBe('00:05')
  })

  it("HH:mm:ss formats 14:07:03 correctly", () => {
    expect(formatTime(new Date(2026, 0, 1, 14, 7, 3), 'HH:mm:ss')).toBe('14:07:03')
  })

  it("hh:mm a formats 09:05 AM correctly", () => {
    expect(formatTime(new Date(2026, 0, 1, 9, 5, 0), 'hh:mm a')).toBe('09:05 AM')
  })

  it("hh:mm:ss a formats 13:07:03 as PM", () => {
    expect(formatTime(new Date(2026, 0, 1, 13, 7, 3), 'hh:mm:ss a')).toBe('01:07:03 PM')
  })

  it("HH:mm formats noon as '12:00'", () => {
    expect(formatTime(new Date(2026, 0, 1, 12, 0, 0), 'HH:mm')).toBe('12:00')
  })

  it("hh:mm a formats noon as '12:00 PM'", () => {
    expect(formatTime(new Date(2026, 0, 1, 12, 0, 0), 'hh:mm a')).toBe('12:00 PM')
  })

  it("hh:mm a formats midnight as '12:00 AM'", () => {
    expect(formatTime(new Date(2026, 0, 1, 0, 0, 0), 'hh:mm a')).toBe('12:00 AM')
  })
})
