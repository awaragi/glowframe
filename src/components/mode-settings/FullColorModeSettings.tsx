import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import type { FullColorProfile } from '@/store'

const schema = z.object({
  lightColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
})

type FormValues = z.infer<typeof schema>

interface Props {
  profile: { id: string; light: FullColorProfile }
  updateLight: (patch: Partial<FormValues>) => void
}

export default function FullColorModeSettings({ profile, updateLight }: Props) {
  const { register, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { lightColor: profile.light.lightColor },
    mode: 'onChange',
  })

  useEffect(() => {
    reset({ lightColor: profile.light.lightColor })
  }, [profile.id, profile.light.lightColor, reset])

  return (
    <section>
      <Label htmlFor="full-color-light-color">Light Color</Label>
      <input
        id="full-color-light-color"
        type="color"
        {...register('lightColor')}
        onChange={(e) => updateLight({ lightColor: e.target.value })}
        className="mt-1 block h-10 w-full cursor-pointer rounded-md border border-input"
        aria-label="Light color picker"
      />
    </section>
  )
}
