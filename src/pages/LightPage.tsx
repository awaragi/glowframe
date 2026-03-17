import { useEffect, useState } from 'react'
import LightSurface from '@/components/LightSurface'
import GearButton from '@/components/GearButton'
import FullscreenButton from '@/components/FullscreenButton'
import SettingsModal from '@/components/SettingsModal'
import { useFullscreen } from '@/hooks/useFullscreen'

export default function LightPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { isAvailable, toggle } = useFullscreen()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key.toLowerCase() !== 'f') return
      if (!isAvailable) return
      const el = document.activeElement
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return
      }
      toggle()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isAvailable, toggle])

  return (
    <>
      <LightSurface />
      <FullscreenButton />
      <GearButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}

