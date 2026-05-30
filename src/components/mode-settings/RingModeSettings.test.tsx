import { z } from 'zod'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import RingModeSettings from './RingModeSettings'
import type { RingProfile } from '@/store'

// Mirror the component's schema to test the cross-validation logic directly
const ringSchema = z
  .object({
    lightTemperature: z.number().min(1000).max(10000),
    lightBrightness: z.number().min(0).max(100),
    innerRadius: z.number().min(0).max(100),
    outerRadius: z.number().min(0).max(100),
    backgroundLightTemperature: z.number().min(0).max(10000),
    backgroundLightBrightness: z.number().min(0).max(100),
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

function makeRingProfile(overrides: Partial<RingProfile> = {}): { id: string; light: RingProfile } {
  return {
    id: 'test-ring',
    light: {
      mode: 'ring',
      lightTemperature: 6500,
      lightBrightness: 100,
      innerRadius: 20,
      outerRadius: 80,
      backgroundLightTemperature: 0,
      backgroundLightBrightness: 0,
      ...overrides,
    },
  }
}

const validBase = {
  lightTemperature: 6500,
  lightBrightness: 100,
  backgroundLightTemperature: 0,
  backgroundLightBrightness: 0,
}

describe('RingModeSettings — Zod schema cross-validation', () => {
  it('passes when innerRadius is strictly less than outerRadius', () => {
    const result = ringSchema.safeParse({ ...validBase, innerRadius: 20, outerRadius: 80 })
    expect(result.success).toBe(true)
  })

  it('fails with correct message when innerRadius equals outerRadius', () => {
    const result = ringSchema.safeParse({ ...validBase, innerRadius: 50, outerRadius: 50 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'innerRadius')
      expect(issue?.message).toBe('Inner radius must be less than outer radius.')
    }
  })

  it('fails with correct message when innerRadius is greater than outerRadius', () => {
    const result = ringSchema.safeParse({ ...validBase, innerRadius: 70, outerRadius: 30 })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'innerRadius')
      expect(issue?.message).toBe('Inner radius must be less than outer radius.')
    }
  })
})

describe('RingModeSettings — component', () => {
  it('does not show error message when radii are initially valid', () => {
    render(<RingModeSettings profile={makeRingProfile()} updateLight={() => {}} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls updateLight when slider changes to a valid value', async () => {
    const updateLight = vi.fn()
    // innerRadius: 20, outerRadius: 80 — pressing ArrowRight on inner gives 21 (still valid)
    render(<RingModeSettings profile={makeRingProfile()} updateLight={updateLight} />)

    const innerLabel = screen.getByText(/Inner Radius/i)
    const section = innerLabel.closest('section')!
    const input = section.querySelector('input[type="range"]') as HTMLInputElement
    input.focus()
    fireEvent.keyDown(input, { key: 'ArrowRight', code: 'ArrowRight' })

    await waitFor(() => {
      expect(updateLight).toHaveBeenCalled()
    })
  })

  it('does not call updateLight when innerRadius meets outerRadius', async () => {
    const updateLight = vi.fn()
    // innerRadius: 79, outerRadius: 80 — one ArrowRight makes them equal (invalid)
    render(
      <RingModeSettings
        profile={makeRingProfile({ innerRadius: 79, outerRadius: 80 })}
        updateLight={updateLight}
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
    expect(updateLight).not.toHaveBeenCalled()
  })
})
