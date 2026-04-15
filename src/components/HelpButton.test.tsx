import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HelpButton from './HelpButton'

describe('HelpButton', () => {
  it('renders with aria-label "Keyboard shortcuts"', () => {
    render(<HelpButton onClick={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Keyboard shortcuts' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<HelpButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Keyboard shortcuts' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
