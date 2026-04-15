import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import HelpDialog from './HelpDialog'

describe('HelpDialog', () => {
  it('is visible when open={true}', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('is not visible when open={false}', () => {
    render(<HelpDialog open={false} onOpenChange={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the Global shortcuts group', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Global shortcuts' })).toBeInTheDocument()
  })

  it('renders the Light surface shortcuts group', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Light surface shortcuts' })).toBeInTheDocument()
  })

  it('renders the Ring & Spot radius shortcuts group', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Ring and Spot radius shortcuts' })).toBeInTheDocument()
  })

  it('renders the Settings modal shortcuts group', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByRole('region', { name: 'Settings modal shortcuts' })).toBeInTheDocument()
  })

  it('renders <kbd> elements', () => {
    render(<HelpDialog open={true} onOpenChange={vi.fn()} />)
    const kbdElements = document.querySelectorAll('kbd')
    expect(kbdElements.length).toBeGreaterThan(0)
  })

  it('calls onOpenChange with false when Escape is pressed', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(<HelpDialog open={true} onOpenChange={onOpenChange} />)
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenCalled()
    expect(onOpenChange.mock.calls[0][0]).toBe(false)
  })
})
