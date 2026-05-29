import { useState, useEffect } from 'react'
import { formatTime } from '@/lib/clockFormat'
import type { ClockFormat } from '@/lib/clockFormat'

export function useClockTime(format: ClockFormat): string {
  const [time, setTime] = useState(() => formatTime(new Date(), format))

  useEffect(() => {
    const id = setInterval(() => {
      setTime(formatTime(new Date(), format))
    }, 1000)
    return () => clearInterval(id)
  }, [format])

  return time
}
