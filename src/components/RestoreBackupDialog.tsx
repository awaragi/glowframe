import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface RestoreBackupDialogProps {
  open: boolean
  profileCount: number
  onConfirm: () => void
  onCancel: () => void
}

export default function RestoreBackupDialog({
  open,
  profileCount,
  onConfirm,
  onCancel,
}: RestoreBackupDialogProps) {
  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="restore-backup-dialog">
        <DialogHeader>
          <DialogTitle>Restore presets</DialogTitle>
          <DialogDescription>
            This will replace all existing presets with{' '}
            <strong>{profileCount} preset{profileCount !== 1 ? 's' : ''}</strong> from the backup
            file. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            aria-label="Cancel restore"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            aria-label={`Restore ${profileCount} preset${profileCount !== 1 ? 's' : ''} from backup`}
            data-testid="confirm-restore-button"
          >
            Restore
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
