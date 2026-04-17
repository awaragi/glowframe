import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, GripVertical } from 'lucide-react'
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
import { useAppStore, selectActiveProfile } from '@/store/index'
import type { Profile, ProfileMode } from '@/store/index'
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

const nameSchema = z.object({
  name: z.string().min(1).max(64),
})

type NameFormValues = z.infer<typeof nameSchema>

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

const MODE_LABELS: Record<ProfileMode['mode'], string> = {
  'full': 'Full',
  'full-color': 'Full Color',
  'ring': 'Ring',
  'ring-color': 'Ring Color',
  'spot': 'Spot',
  'spot-color': 'Spot Color',
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const profiles = useAppStore((s) => s.profiles)
  const activeProfileId = useAppStore((s) => s.activeProfileId)
  const activeProfile = useAppStore(selectActiveProfile)
  const createProfile = useAppStore((s) => s.createProfile)
  const renameProfile = useAppStore((s) => s.renameProfile)
  const deleteProfile = useAppStore((s) => s.deleteProfile)
  const setActiveProfile = useAppStore((s) => s.setActiveProfile)
  const storeUpdateProfile = useAppStore((s) => s.updateProfile)
  const switchMode = useAppStore((s) => s.switchMode)
  const reorderProfiles = useAppStore((s) => s.reorderProfiles)

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

  const updateProfile = (patch: Parameters<typeof storeUpdateProfile>[1]) =>
    storeUpdateProfile(activeProfileId, patch)

  const { register, reset } = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: activeProfile.name },
  })

  useEffect(() => {
    reset({ name: activeProfile.name })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId, reset])

  function renderModeSettings() {
    switch (activeProfile.mode) {
      case 'full':
        return <FullModeSettings profile={activeProfile} updateProfile={updateProfile} />
      case 'full-color':
        return <FullColorModeSettings profile={activeProfile} updateProfile={updateProfile} />
      case 'ring':
        return <RingModeSettings profile={activeProfile} updateProfile={updateProfile} />
      case 'ring-color':
        return <RingColorModeSettings profile={activeProfile} updateProfile={updateProfile} />
      case 'spot':
        return <SpotModeSettings profile={activeProfile} updateProfile={updateProfile} />
      case 'spot-color':
        return <SpotColorModeSettings profile={activeProfile} updateProfile={updateProfile} />
    }
  }

  return (
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
              <h3 className="text-sm font-medium">Profiles</h3>
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

          {/* Mode selector */}
          <section>
            <Label>Mode</Label>
            <Select
              value={activeProfile.mode}
              onValueChange={(value) => switchMode(activeProfileId, value as ProfileMode['mode'])}
            >
              <SelectTrigger
                className="mt-1 w-full"
                aria-label="Mode selector"
                data-testid="mode-selector"
              >
                {MODE_LABELS[activeProfile.mode]}
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(MODE_LABELS) as [ProfileMode['mode'], string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

          {/* Mode-specific settings */}
          {renderModeSettings()}
        </div>
      </SheetContent>
    </Sheet>
  )
}
