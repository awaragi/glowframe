import { Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFullscreen } from '@/hooks/useFullscreen'

export default function FullscreenButton() {
  const { isFullscreen, isAvailable, toggle } = useFullscreen()

  if (!isAvailable) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      onClick={toggle}
      className="fixed top-4 right-16 z-50 bg-black/20 text-white hover:bg-black/40 hover:text-white"
    >
      {isFullscreen ? (
        <Minimize2 className="size-5" />
      ) : (
        <Maximize2 className="size-5" />
      )}
    </Button>
  )
}
