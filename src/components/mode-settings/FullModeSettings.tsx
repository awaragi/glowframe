import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { FullProfile } from '@/store'

const schema = z.object({
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
})

type FormValues = z.infer<typeof schema>

interface Props {
  profile: { id: string } & FullProfile
  updateProfile: (patch: Partial<FormValues>) => void
}

export default function FullModeSettings({ profile, updateProfile }: Props) {
  const { setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lightTemperature: profile.lightTemperature,
      lightBrightness: profile.lightBrightness,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      lightTemperature: profile.lightTemperature,
      lightBrightness: profile.lightBrightness,
    })
  }, [profile.id, profile.lightTemperature, profile.lightBrightness, reset])

  function patch<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValue(key, value as never)
    updateProfile({ [key]: value })
  }

  return (
    <>
      <section>
        <Label>Light Temperature ({watch('lightTemperature')}K)</Label>
        <Slider
          className="mt-2"
          value={[watch('lightTemperature')]}
          onValueChange={(v) => patch('lightTemperature', Array.isArray(v) ? v[0] : (v as number))}
          min={1000}
          max={10000}
          step={100}
          aria-label="Light temperature"
        />
      </section>
      <section>
        <Label>Light Brightness ({watch('lightBrightness')}%)</Label>
        <Slider
          className="mt-2"
          value={[watch('lightBrightness')]}
          onValueChange={(v) => patch('lightBrightness', Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={100}
          step={1}
          aria-label="Light brightness"
        />
      </section>
    </>
  )
}
