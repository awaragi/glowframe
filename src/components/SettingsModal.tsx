import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { useAppStore, selectActiveProfile } from '@/store/index'
import type { Profile } from '@/store/index'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
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

const profileSchema = z.object({
  name: z.string().min(1).max(64),
  lightColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  brightness: z.number().min(0).max(100),
  colorTemperature: z.number().min(1000).max(10000),
  ringFormat: z.enum(['full', 'circle', 'border']),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
})

type ProfileFormValues = z.infer<typeof profileSchema>

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
  const updateProfile = useAppStore((s) => s.updateProfile)

  const { register, setValue, watch, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: activeProfile.name,
      lightColor: activeProfile.lightColor,
      brightness: activeProfile.brightness,
      colorTemperature: activeProfile.colorTemperature,
      ringFormat: activeProfile.ringFormat,
      innerRadius: activeProfile.innerRadius,
      outerRadius: activeProfile.outerRadius,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      name: activeProfile.name,
      lightColor: activeProfile.lightColor,
      brightness: activeProfile.brightness,
      colorTemperature: activeProfile.colorTemperature,
      ringFormat: activeProfile.ringFormat,
      innerRadius: activeProfile.innerRadius,
      outerRadius: activeProfile.outerRadius,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfileId, reset])

  function patch<K extends keyof ProfileFormValues>(field: K, value: ProfileFormValues[K]) {
    setValue(field, value)
    updateProfile(activeProfileId, { [field]: value } as Partial<Omit<Profile, 'id'>>)
  }

  const ringFormat = watch('ringFormat')

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
                    disabled={profiles.length <= 1}
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

          {/* Light color */}
          <section>
            <Label htmlFor="light-color">Light Color</Label>
            <input
              id="light-color"
              type="color"
              {...register('lightColor')}
              onChange={(e) => patch('lightColor', e.target.value)}
              className="mt-1 block h-10 w-full cursor-pointer rounded-md border border-input"
              aria-label="Light color picker"
            />
          </section>

          {/* Brightness */}
          <section>
            <Label>Brightness ({watch('brightness')}%)</Label>
            <Slider
              className="mt-2"
              value={[watch('brightness')]}
              onValueChange={(v) => patch('brightness', Array.isArray(v) ? v[0] : (v as number))}
              min={0}
              max={100}
              step={1}
              aria-label="Brightness"
            />
          </section>

          {/* Color Temperature */}
          <section>
            <Label>Color Temperature ({watch('colorTemperature')}K)</Label>
            <Slider
              className="mt-2"
              value={[watch('colorTemperature')]}
              onValueChange={(v) => patch('colorTemperature', Array.isArray(v) ? v[0] : (v as number))}
              min={1000}
              max={10000}
              step={100}
              aria-label="Color temperature"
            />
          </section>

          {/* Ring Format */}
          <section>
            <Label>Ring Format</Label>
            <Select
              value={watch('ringFormat')}
              onValueChange={(value) =>
                patch('ringFormat', value as 'full' | 'circle' | 'border')
              }
            >
              <SelectTrigger className="mt-1 w-full" aria-label="Ring format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="border">Border</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Inner/Outer Radius — only when ringFormat !== 'full' */}
          {ringFormat !== 'full' && (
            <>
              <section>
                <Label>Inner Radius ({watch('innerRadius')}%)</Label>
                <Slider
                  className="mt-2"
                  value={[watch('innerRadius')]}
                  onValueChange={(v) => patch('innerRadius', Array.isArray(v) ? v[0] : (v as number))}
                  min={0}
                  max={100}
                  step={1}
                  aria-label="Inner radius"
                />
              </section>
              <section>
                <Label>Outer Radius ({watch('outerRadius')}%)</Label>
                <Slider
                  className="mt-2"
                  value={[watch('outerRadius')]}
                  onValueChange={(v) => patch('outerRadius', Array.isArray(v) ? v[0] : (v as number))}
                  min={0}
                  max={100}
                  step={1}
                  aria-label="Outer radius"
                />
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
