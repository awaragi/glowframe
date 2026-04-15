import { CircleHelp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HelpButtonProps {
  onClick: () => void
}

export default function HelpButton({ onClick }: HelpButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Keyboard shortcuts"
      onClick={onClick}
      className="fixed top-4 right-28 z-50 bg-black/20 text-white hover:bg-black/40 hover:text-white"
    >
      <CircleHelp className="size-5" />
    </Button>
  )
}
