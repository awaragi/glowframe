import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, GripVertical, Share2, Download, Upload } from 'lucide-react'
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Tabs } from '@base-ui/react/tabs'
import { Switch } from '@base-ui/react/switch'
import { useAppStore, selectActiveProfile } from '@/store/index'
import type { Profile, LightConfig, ClockConfig } from '@/store/index'
import { MODE_LABELS } from '@/lib/modeCycle'
import { encodeProfile } from '@/lib/profileShare'
import { exportBackup, importBackup } from '@/lib/profileBackup'
import type { BackupPayload } from '@/lib/profileBackup'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import FullModeSettings from '@/components/mode-settings/FullModeSettings'
import FullColorModeSettings from '@/components/mode-settings/FullColorModeSettings'
import RingModeSettings from '@/components/mode-settings/RingModeSettings'
import RingColorModeSettings from '@/components/mode-settings/RingColorModeSettings'
import SpotModeSettings from '@/components/mode-settings/SpotModeSettings'
import SpotColorModeSettings from '@/components/mode-settings/SpotColorModeSettings'
import RestoreBackupDialog from '@/components/RestoreBackupDialog'

const nameSchema = z.object({
  name: z.string().min(1).max(64),
})

type NameFormValues = z.infer<typeof nameSchema>

const clockSchema = z.object({
  enabled: z.boolean(),
  position: z.enum(['top-left', 'bottom-left', 'bottom-right']),
  size: z.enum(['small', 'medium', 'large']),
  format: z.enum(['HH:mm', 'HH:mm:ss', 'hh:mm a', 'hh:mm:ss a']),
})

type ClockFormValues = z.infer<typeof clockSchema>

interface SortableProfileItemProps {
  profile: Profile
  sequenceNumber: number
  currentIndex: number
  totalProfiles: number
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

function SortableProfileItem({
  profile,
  sequenceNumber,
  currentIndex,
  totalProfiles,
  isActive,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SortableProfileItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: profile.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-2">
      <button
        {...attributes}
        {...listeners}
        data-drag-handle
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault()
            if (currentIndex > 0) onMoveUp()
          } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (currentIndex < totalProfiles - 1) onMoveDown()
          }
        }}
        className="shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium tabular-nums text-muted-foreground">
        {sequenceNumber}
      </span>
      <button
        className={`flex-1 rounded px-2 py-1 text-left text-sm transition-colors ${
          isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
        onClick={onSelect}
        aria-pressed={isActive}
      >
        {profile.name}
      </button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0"
        onClick={onDelete}
        aria-label={`Delete ${profile.name}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
  )
}

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const profiles = useAppStore((s) => s.profiles)
  const activeProfileId = useAppStore((s) => s.activeProfileId)
  const activeProfile = useAppStore(selectActiveProfile)
  const createProfile = useAppStore((s) => s.createProfile)
  const renameProfile = useAppStore((s) => s.renameProfile)
  const deleteProfile = useAppStore((s) => s.deleteProfile)
  const setActiveProfile = useAppStore((s) => s.setActiveProfile)
  const storeUpdateLight = useAppStore((s) => s.updateLight)
  const storeUpdateClock = useAppStore((s) => s.updateClock)
  const switchMode = useAppStore((s) => s.switchMode)
  const reorderProfiles = useAppStore((s) => s.reorderProfiles)
  const restoreProfiles = useAppStore((s) => s.restoreProfiles)

  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [pendingBackup, setPendingBackup] = useState<BackupPayload | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
  )

  function handleDragStart() {
    document.body.setAttribute('data-dnd-active', '')
  }

  function handleDragEnd(event: DragEndEvent) {
    document.body.removeAttribute('data-dnd-active')
    const { active, over } = event
    if (!over || active.id === over.id) return
    const fromIndex = profiles.findIndex((p) => p.id === active.id)
    const toIndex = profiles.findIndex((p) => p.id === over.id)
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderProfiles(fromIndex, toIndex)
    }
  }

  function handleDragCancel() {
    document.body.removeAttribute('data-dnd-active')
  }

  const updateLight = (patch: Parameters<typeof storeUpdateLight>[1]) =>
    storeUpdateLight(activeProfileId, patch)

  const { register, reset } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: activeProfile.name },
  })

  useEffect(() => {
    reset({ name: activeProfile.name })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId, reset])

  const activeClock = activeProfile.clock
  const { setValue: setClockField, watch: watchClock, reset: resetClock } = useForm<ClockFormValues>({
    resolver: zodResolver(clockSchema),
    defaultValues: {
      enabled: activeClock.enabled,
      position: activeClock.position,
      size: activeClock.size,
      format: activeClock.format,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    const c = activeProfile.clock
    resetClock({ enabled: c.enabled, position: c.position, size: c.size, format: c.format })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId, resetClock])

  function patchClock<K extends keyof ClockFormValues>(key: K, value: ClockFormValues[K]) {
    setClockField(key, value as never)
    storeUpdateClock(activeProfileId, { [key]: value } as Partial<ClockConfig>)
  }

  function renderModeSettings() {
    switch (activeProfile.light.mode) {
      case 'full': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <FullModeSettings profile={p} updateLight={updateLight} />
      }
      case 'full-color': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <FullColorModeSettings profile={p} updateLight={updateLight} />
      }
      case 'ring': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <RingModeSettings profile={p} updateLight={updateLight} />
      }
      case 'ring-color': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <RingColorModeSettings profile={p} updateLight={updateLight} />
      }
      case 'spot': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <SpotModeSettings profile={p} updateLight={updateLight} />
      }
      case 'spot-color': {
        const p = { id: activeProfile.id, light: activeProfile.light }
        return <SpotColorModeSettings profile={p} updateLight={updateLight} />
      }
    }
  }

  async function handleCopyShareLink() {
    const url =
      window.location.origin +
      window.location.pathname +
      '?profile=' +
      encodeProfile(activeProfile)
    await navigator.clipboard.writeText(url)
    toast.success('Link copied!')
  }

  function handleExportBackup() {
    const json = exportBackup(profiles)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'glowframe-backup.json'
    anchor.click()
    URL.revokeObjectURL(url)
    toast.success('Presets exported!')
  }

  function handleRestoreFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const backup = importBackup(text)
      if (!backup) {
        toast.error('Invalid backup file')
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
      setPendingBackup(backup)
      setRestoreDialogOpen(true)
    }
    reader.readAsText(file)
  }

  function handleRestoreConfirm() {
    if (!pendingBackup) return
    restoreProfiles(pendingBackup.profiles)
    toast.success(`${pendingBackup.profiles.length} preset${pendingBackup.profiles.length !== 1 ? 's' : ''} restored!`)
    setPendingBackup(null)
    setRestoreDialogOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRestoreCancel() {
    setPendingBackup(null)
    setRestoreDialogOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="overflow-y-auto bg-background/90 backdrop-blur-sm"
        data-testid="settings-modal"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4">
          {/* Profile list */}
          <section aria-label="Profiles">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-medium">Profiles</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleExportBackup}
                  aria-label="Export presets as backup file"
                  data-testid="export-presets-button"
                >
                  <Download className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Restore presets from backup file"
                  data-testid="restore-presets-button"
                >
                  <Upload className="size-3.5" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="sr-only"
                  aria-hidden="true"
                  tabIndex={-1}
                  onChange={handleRestoreFileChange}
                  data-testid="restore-file-input"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => createProfile('New Profile')}
                aria-label="New profile"
              >
                <Plus className="mr-1 size-4" />
                New
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={profiles.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="flex flex-col gap-1" aria-label="Profile list">
                  {profiles.map((profile, index) => (
                    <SortableProfileItem
                      key={profile.id}
                      profile={profile}
                      sequenceNumber={index + 1}
                      currentIndex={index}
                      totalProfiles={profiles.length}
                      isActive={profile.id === activeProfileId}
                      onSelect={() => setActiveProfile(profile.id)}
                      onDelete={() => deleteProfile(profile.id)}
                      onMoveUp={() => reorderProfiles(index, index - 1)}
                      onMoveDown={() => reorderProfiles(index, index + 1)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </section>

          {/* Rename active profile */}
          <section>
            <Label htmlFor="profile-name">Profile Name</Label>
            <Input
              id="profile-name"
              {...register('name')}
              onBlur={(e) => {
                const value = e.currentTarget.value.trim()
                if (value) renameProfile(activeProfileId, value)
              }}
              className="mt-1"
            />
          </section>

          {/* Tabs: Light / Clock */}
          <Tabs.Root defaultValue="light" className="flex flex-col gap-0">
            <Tabs.List
              activateOnFocus
              className="flex border-b border-border"
            >
              <Tabs.Tab
                value="light"
                className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-selected:border-b-2 aria-selected:border-primary aria-selected:text-foreground"
              >
                Light
              </Tabs.Tab>
              <Tabs.Tab
                value="clock"
                className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground aria-selected:border-b-2 aria-selected:border-primary aria-selected:text-foreground"
              >
                Clock
              </Tabs.Tab>
            </Tabs.List>

            {/* Light tab */}
            <Tabs.Panel value="light" className="flex flex-col gap-6 pt-4">
              {/* Mode selector */}
              <section>
                <Label>Mode</Label>
                <Select
                  value={activeProfile.light.mode}
                  onValueChange={(value) => switchMode(activeProfileId, value as LightConfig['mode'])}
                >
                  <SelectTrigger
                    className="mt-1 w-full"
                    aria-label="Mode selector"
                    data-testid="mode-selector"
                  >
                    {MODE_LABELS[activeProfile.light.mode]}
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(MODE_LABELS) as [LightConfig['mode'], string][]).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </section>

              {/* Mode-specific settings */}
              {renderModeSettings()}

            </Tabs.Panel>

            {/* Clock tab */}
            <Tabs.Panel value="clock" className="flex flex-col gap-4 pt-4">
              {/* Show clock toggle */}
              <section className="flex items-center justify-between">
                <Label>Show clock</Label>
                <Switch.Root
                  aria-label="Show clock"
                  checked={watchClock('enabled')}
                  onCheckedChange={(checked) => patchClock('enabled', checked)}
                  className="relative inline-flex h-6 w-11 cursor-pointer rounded-full border-2 border-transparent bg-input transition-colors data-[checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[checked]:translate-x-5" />
                </Switch.Root>
              </section>

              {/* Position selector */}
              <section>
                <Label>Position</Label>
                <Select
                  value={watchClock('position')}
                  onValueChange={(v) => patchClock('position', v as ClockFormValues['position'])}
                  disabled={!watchClock('enabled')}
                >
                  <SelectTrigger className="mt-1 w-full" aria-label="Position">
                    {{ 'top-left': 'Top-left', 'bottom-left': 'Bottom-left', 'bottom-right': 'Bottom-right' }[watchClock('position')]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top-left</SelectItem>
                    <SelectItem value="bottom-left">Bottom-left</SelectItem>
                    <SelectItem value="bottom-right">Bottom-right</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              {/* Size selector */}
              <section>
                <Label>Size</Label>
                <Select
                  value={watchClock('size')}
                  onValueChange={(v) => patchClock('size', v as ClockFormValues['size'])}
                  disabled={!watchClock('enabled')}
                >
                  <SelectTrigger className="mt-1 w-full" aria-label="Size">
                    {{ small: 'Small', medium: 'Medium', large: 'Large' }[watchClock('size')]}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </section>

              {/* Format selector */}
              <section>
                <Label>Format</Label>
                <Select
                  value={watchClock('format')}
                  onValueChange={(v) => patchClock('format', v as ClockFormValues['format'])}
                  disabled={!watchClock('enabled')}
                >
                  <SelectTrigger className="mt-1 w-full" aria-label="Format">
                    {watchClock('format')}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HH:mm">HH:mm</SelectItem>
                    <SelectItem value="HH:mm:ss">HH:mm:ss</SelectItem>
                    <SelectItem value="hh:mm a">hh:mm a</SelectItem>
                    <SelectItem value="hh:mm:ss a">hh:mm:ss a</SelectItem>
                  </SelectContent>
                </Select>
              </section>
            </Tabs.Panel>
          </Tabs.Root>

          {/* Share — always visible below tabs */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopyShareLink}
            aria-label="Copy share link for active profile"
            data-testid="copy-share-link"
          >
            <Share2 className="mr-2 size-4" />
            Copy share link
          </Button>
        </div>
      </SheetContent>
    </Sheet>

    <RestoreBackupDialog
      open={restoreDialogOpen}
      profileCount={pendingBackup?.profiles.length ?? 0}
      onConfirm={handleRestoreConfirm}
      onCancel={handleRestoreCancel}
    />
    </>
  )
}
