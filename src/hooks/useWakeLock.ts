import { useEffect, useRef } from 'react'

export function useWakeLock(): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null)

  useEffect(() => {
    if (!('wakeLock' in navigator)) return

    async function acquire(): Promise<void> {
      try {
        sentinelRef.current = await navigator.wakeLock.request('screen')
      } catch {
        // Silently swallow — unsupported or permission denied
      }
    }

    function handleVisibilityChange(): void {
      if (document.visibilityState === 'hidden') {
        sentinelRef.current?.release().catch(() => {})
        sentinelRef.current = null
      } else if (document.visibilityState === 'visible') {
        void acquire()
      }
    }

    void acquire()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      sentinelRef.current?.release().catch(() => {})
      sentinelRef.current = null
    }
  }, [])
}
