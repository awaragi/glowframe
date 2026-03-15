import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { RingProfile } from '@/store'

const schema = z.object({
  lightTemperature: z.number().min(1000).max(10000),
  lightBrightness: z.number().min(0).max(100),
  innerRadius: z.number().min(0).max(100),
  outerRadius: z.number().min(0).max(100),
  backgroundLightTemperature: z.number().min(0).max(10000),
  backgroundLightBrightness: z.number().min(0).max(100),
})

type FormValues = z.infer<typeof schema>

interface Props {
  profile: { id: string } & RingProfile
  updateProfile: (patch: Partial<FormValues>) => void
}

export default function RingModeSettings({ profile, updateProfile }: Props) {
  const { setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lightTemperature: profile.lightTemperature,
      lightBrightness: profile.lightBrightness,
      innerRadius: profile.innerRadius,
      outerRadius: profile.outerRadius,
      backgroundLightTemperature: profile.backgroundLightTemperature,
      backgroundLightBrightness: profile.backgroundLightBrightness,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      lightTemperature: profile.lightTemperature,
      lightBrightness: profile.lightBrightness,
      innerRadius: profile.innerRadius,
      outerRadius: profile.outerRadius,
      backgroundLightTemperature: profile.backgroundLightTemperature,
      backgroundLightBrightness: profile.backgroundLightBrightness,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id, reset])

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
      <section>
        <Label>Background Light Temperature ({watch('backgroundLightTemperature')}K)</Label>
        <Slider
          className="mt-2"
          value={[watch('backgroundLightTemperature')]}
          onValueChange={(v) => patch('backgroundLightTemperature', Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={10000}
          step={100}
          aria-label="Background light temperature"
        />
      </section>
      <section>
        <Label>Background Light Brightness ({watch('backgroundLightBrightness')}%)</Label>
        <Slider
          className="mt-2"
          value={[watch('backgroundLightBrightness')]}
          onValueChange={(v) => patch('backgroundLightBrightness', Array.isArray(v) ? v[0] : (v as number))}
          min={0}
          max={100}
          step={1}
          aria-label="Background light brightness"
        />
      </section>
    </>
  )
}
