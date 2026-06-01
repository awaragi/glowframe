import { render, screen, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import ModeNameOverlay from './ModeNameOverlay'
import { MODE_OVERLAY_DURATION_MS } from '@/lib/modeCycle'

describe('ModeNameOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the label when label is set', () => {
    render(<ModeNameOverlay label="Ring" onDismiss={vi.fn()} />)
    expect(screen.getByText('Ring')).toBeInTheDocument()
  })

  it('renders nothing when label is null', () => {
    const { container } = render(<ModeNameOverlay label={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('calls onDismiss after MODE_OVERLAY_DURATION_MS', () => {
    const onDismiss = vi.fn()
    render(<ModeNameOverlay label="Spot" onDismiss={onDismiss} />)
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => { vi.advanceTimersByTime(MODE_OVERLAY_DURATION_MS) })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('does not call onDismiss before duration elapses', () => {
    const onDismiss = vi.fn()
    render(<ModeNameOverlay label="Full" onDismiss={onDismiss} />)
    act(() => { vi.advanceTimersByTime(MODE_OVERLAY_DURATION_MS - 1) })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('restarts dismiss timer when label changes', () => {
    const onDismiss = vi.fn()
    const { rerender } = render(<ModeNameOverlay label="Full" onDismiss={onDismiss} />)

    act(() => { vi.advanceTimersByTime(MODE_OVERLAY_DURATION_MS - 100) })
    expect(onDismiss).not.toHaveBeenCalled()

    rerender(<ModeNameOverlay label="Ring" onDismiss={onDismiss} />)
    expect(screen.getByText('Ring')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(MODE_OVERLAY_DURATION_MS - 1) })
    expect(onDismiss).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(1) })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('has a semi-transparent backdrop class on the inner element', () => {
    render(<ModeNameOverlay label="Full Color" onDismiss={vi.fn()} />)
    const inner = screen.getByText('Full Color')
    expect(inner.className).toContain('bg-black/40')
  })

  it('outer wrapper has pointer-events-none', () => {
    render(<ModeNameOverlay label="Ring" onDismiss={vi.fn()} />)
    const wrapper = screen.getByRole('status')
    expect(wrapper.className).toContain('pointer-events-none')
  })

  it('has role="status" and aria-live="polite"', () => {
    render(<ModeNameOverlay label="Full Color" onDismiss={vi.fn()} />)
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('aria-live', 'polite')
  })

  it('does not call onDismiss when label is null', () => {
    const onDismiss = vi.fn()
    render(<ModeNameOverlay label={null} onDismiss={onDismiss} />)
    act(() => { vi.advanceTimersByTime(MODE_OVERLAY_DURATION_MS * 2) })
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
