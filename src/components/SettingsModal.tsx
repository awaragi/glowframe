import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { useAppStore, selectActiveProfile } from '@/store/index'
import type { ProfileMode } from '@/store/index'
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
  SelectValue,
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
            <ul className="flex flex-col gap-1" aria-label="Profile list">
              {profiles.map((profile) => (
                <li key={profile.id} className="flex items-center gap-2">
                  <button
                    className={`flex-1 rounded px-2 py-1 text-left text-sm transition-colors ${
                      profile.id === activeProfileId
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveProfile(profile.id)}
                    aria-pressed={profile.id === activeProfileId}
                  >
                    {profile.name}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => deleteProfile(profile.id)}
                    aria-label={`Delete ${profile.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
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
