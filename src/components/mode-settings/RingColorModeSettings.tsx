import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { RingColorProfile } from '@/store'

const schema = z
  .object({
    lightColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    innerRadius: z.number().min(0).max(100),
    outerRadius: z.number().min(0).max(100),
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  })
  .superRefine((data, ctx) => {
    if (data.innerRadius >= data.outerRadius) {
      ctx.addIssue({
        code: 'custom',
        message: 'Inner radius must be less than outer radius.',
        path: ['innerRadius'],
      })
    }
  })

type FormValues = z.infer<typeof schema>

interface Props {
  profile: { id: string } & RingColorProfile
  updateProfile: (patch: Partial<FormValues>) => void
}

export default function RingColorModeSettings({ profile, updateProfile }: Props) {
  const { register, setValue, watch, reset, trigger, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lightColor: profile.lightColor,
      innerRadius: profile.innerRadius,
      outerRadius: profile.outerRadius,
      backgroundColor: profile.backgroundColor,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({
      lightColor: profile.lightColor,
      innerRadius: profile.innerRadius,
      outerRadius: profile.outerRadius,
      backgroundColor: profile.backgroundColor,
    })
  }, [profile.id, profile.lightColor, profile.innerRadius, profile.outerRadius, profile.backgroundColor, reset])

  async function patch<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValue(key, value as never)
    const valid = await trigger()
    if (valid) {
      updateProfile({ [key]: value })
    }
  }

  return (
    <>
      <section>
        <Label htmlFor="ring-color-light-color">Light Color</Label>
        <input
          id="ring-color-light-color"
          type="color"
          {...register('lightColor')}
          onChange={(e) => patch('lightColor', e.target.value)}
          className="mt-1 block h-10 w-full cursor-pointer rounded-md border border-input"
          aria-label="Light color picker"
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
      {formState.errors.innerRadius && (
        <p className="text-sm text-destructive" role="alert">
          {formState.errors.innerRadius.message}
        </p>
      )}
      <section>
        <Label htmlFor="ring-color-bg-color">Background Color</Label>
        <input
          id="ring-color-bg-color"
          type="color"
          {...register('backgroundColor')}
          onChange={(e) => patch('backgroundColor', e.target.value)}
          className="mt-1 block h-10 w-full cursor-pointer rounded-md border border-input"
          aria-label="Background color picker"
        />
      </section>
    </>
  )
}
