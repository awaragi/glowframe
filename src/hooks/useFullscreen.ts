import { useCallback, useEffect, useState } from 'react'

interface UseFullscreenReturn {
  isFullscreen: boolean
  isAvailable: boolean
  toggle: () => void
}

export function useFullscreen(): UseFullscreenReturn {
  const isAvailable =
    'fullscreenEnabled' in document && document.fullscreenEnabled

  const [isFullscreen, setIsFullscreen] = useState(
    () => document.fullscreenElement != null,
  )

  useEffect(() => {
    function handleChange(): void {
      setIsFullscreen(document.fullscreenElement != null)
    }

    document.addEventListener('fullscreenchange', handleChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
    }
  }, [])

  const toggle = useCallback((): void => {
    if (!isAvailable) return

    if (document.fullscreenElement == null) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [isAvailable])

  return { isFullscreen, isAvailable, toggle }
}
