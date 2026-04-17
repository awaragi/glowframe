import { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/index'
import type { Profile } from '@/store/index'
import type { SharedProfile } from '@/lib/profileShare'

const MODE_LABELS: Record<SharedProfile['mode'], string> = {
  'full': 'Full',
  'full-color': 'Full Color',
  'ring': 'Ring',
  'ring-color': 'Ring Color',
  'spot': 'Spot',
  'spot-color': 'Spot Color',
}

interface ImportProfileDialogProps {
  profile: SharedProfile
  onImport: () => void
  onDismiss: () => void
}

export default function ImportProfileDialog({
  profile,
  onImport,
  onDismiss,
}: ImportProfileDialogProps) {
  const importProfile = useAppStore((s) => s.importProfile)
  const setActiveProfile = useAppStore((s) => s.setActiveProfile)
  const importConfirmed = useRef(false)

  function handleImport() {
    importConfirmed.current = true
    const newId = importProfile(profile as Omit<Profile, 'id'>)
    setActiveProfile(newId)
    onImport()
  }

  function handleOpenChange(open: boolean) {
    if (!open && !importConfirmed.current) {
      onDismiss()
    }
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent data-testid="import-profile-dialog">
        <DialogHeader>
          <DialogTitle>Import Profile</DialogTitle>
          <DialogDescription>
            Import &ldquo;{profile.name}&rdquo; ({MODE_LABELS[profile.mode]}) as a new preset?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={onDismiss}
            aria-label="Dismiss profile import"
          >
            Dismiss
          </Button>
          <Button
            onClick={handleImport}
            aria-label={`Import profile "${profile.name}"`}
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
