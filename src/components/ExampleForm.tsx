/**
 * Minimal RHF + Zod integration example used to verify the setup compiles.
 * Not used in the app itself — real forms are implemented in F-100.
 */
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
})

type FormValues = z.infer<typeof schema>

export function ExampleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <input {...register('label')} />
      {errors.label && <p role="alert">{errors.label.message}</p>}
      <button type="submit">Submit</button>
    </form>
  )
}
