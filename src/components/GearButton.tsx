import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GearButtonProps {
  onClick: () => void
}

export default function GearButton({ onClick }: GearButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open settings"
      onClick={onClick}
      className="fixed top-4 right-4 z-50 bg-black/20 text-white hover:bg-black/40 hover:text-white"
    >
      <Settings2 className="size-5" />
    </Button>
  )
}
