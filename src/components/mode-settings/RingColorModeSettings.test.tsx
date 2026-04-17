import { z } from 'zod'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import RingColorModeSettings from './RingColorModeSettings'
import type { RingColorProfile } from '@/store'

// Mirror the component's schema to test the cross-validation logic directly
const ringColorSchema = z
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

function makeRingColorProfile(
  overrides: Partial<RingColorProfile> = {},
): { id: string } & RingColorProfile {
  return {
    id: 'test-ring-color',
    mode: 'ring-color',
    lightColor: '#ffffff',
    innerRadius: 20,
    outerRadius: 80,
    backgroundColor: '#000000',
    ...overrides,
  }
}

const validBase = { lightColor: '#ffffff', backgroundColor: '#000000' }

describe('RingColorModeSettings — Zod schema cross-validation', () => {
  it('passes when innerRadius is strictly less than outerRadius', () => {
    const result = ringColorSchema.safeParse({ ...validBase, innerRadius: 20, outerRadius: 80 })
    expect(result.success).toBe(true)
  })

  it('fails with correct message when innerRadius equals outerRadius', () => {
    const result = ringColorSchema.safeParse({ ...validBase, innerRadius: 50, outerRadius: 50 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'innerRadius')
      expect(issue?.message).toBe('Inner radius must be less than outer radius.')
    }
  })

  it('fails with correct message when innerRadius is greater than outerRadius', () => {
    const result = ringColorSchema.safeParse({ ...validBase, innerRadius: 70, outerRadius: 30 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'innerRadius')
      expect(issue?.message).toBe('Inner radius must be less than outer radius.')
    }
  })
})

describe('RingColorModeSettings — component', () => {
  it('does not show error message when radii are initially valid', () => {
    render(<RingColorModeSettings profile={makeRingColorProfile()} updateProfile={() => {}} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls updateProfile when slider changes to a valid value', async () => {
    const updateProfile = vi.fn()
    // innerRadius: 20, outerRadius: 80 — pressing ArrowRight on inner gives 21 (still valid)
    render(
      <RingColorModeSettings profile={makeRingColorProfile()} updateProfile={updateProfile} />,
    )

    const innerLabel = screen.getByText(/Inner Radius/i)
    const section = innerLabel.closest('section')!
    const input = section.querySelector('input[type="range"]') as HTMLInputElement
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight' })

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalled()
    })
  })

  it('does not call updateProfile when innerRadius meets outerRadius', async () => {
    const updateProfile = vi.fn()
    // innerRadius: 79, outerRadius: 80 — one ArrowRight makes them equal (invalid)
    render(
      <RingColorModeSettings
        profile={makeRingColorProfile({ innerRadius: 79, outerRadius: 80 })}
        updateProfile={updateProfile}
      />,
    )

    const innerLabel = screen.getByText(/Inner Radius/i)
    const section = innerLabel.closest('section')!
    const input = section.querySelector('input[type="range"]') as HTMLInputElement
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight' })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Inner radius must be less than outer radius.',
      )
    })
    expect(updateProfile).not.toHaveBeenCalled()
  })
})
