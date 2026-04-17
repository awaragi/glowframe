import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import type { KeyBinding } from '@/hooks/useKeyboardShortcuts'

function fireKeydown(key: string, shiftKey = false) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
}

describe('useKeyboardShortcuts', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls handler when key matches and no form control has focus', () => {
    const handler = vi.fn()
    const bindings: KeyBinding[] = [{ key: 'a', handler }]
    renderHook(() => useKeyboardShortcuts(bindings))
    fireKeydown('a')
    expect(handler).toHaveBeenCalledOnce()
  })

  it('is case-insensitive — uppercase key fires binding registered as lowercase', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'f', handler }]))
    fireKeydown('F', true)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('is silent when an HTMLInputElement has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.focus()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
    input.blur()
    document.body.removeChild(input)
  })

  it('is silent when an input type="range" has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    const range = document.createElement('input')
    range.type = 'range'
    document.body.appendChild(range)
    range.focus()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
    range.blur()
    document.body.removeChild(range)
  })

  it('is silent when an HTMLSelectElement has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    const select = document.createElement('select')
    document.body.appendChild(select)
    select.focus()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
    select.blur()
    document.body.removeChild(select)
  })

  it('is silent when an HTMLTextAreaElement has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)
    textarea.focus()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
    textarea.blur()
    document.body.removeChild(textarea)
  })

  it('is silent when a contentEditable element has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    const div = document.createElement('div')
    div.contentEditable = 'true'
    div.tabIndex = 0
    document.body.appendChild(div)
    div.focus()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
    div.blur()
    document.body.removeChild(div)
  })

  it('fires when shift binding is registered and shift is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: '[', shift: true, handler }]))
    fireKeydown('[', true)
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not fire when shift binding is registered but shift is not pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: '[', shift: true, handler }]))
    fireKeydown('[', false)
    expect(handler).not.toHaveBeenCalled()
  })

  it('removes the listener on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useKeyboardShortcuts([{ key: 'a', handler }]))
    unmount()
    fireKeydown('a')
    expect(handler).not.toHaveBeenCalled()
  })

  it('is silent when a drag handle (data-drag-handle) has focus', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'ArrowUp', handler }]))
    const btn = document.createElement('button')
    btn.setAttribute('data-drag-handle', '')
    document.body.appendChild(btn)
    btn.focus()
    fireKeydown('ArrowUp')
    expect(handler).not.toHaveBeenCalled()
    btn.blur()
    document.body.removeChild(btn)
  })

  it('is silent when a dnd drag is active (data-dnd-active on body)', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'ArrowUp', handler }]))
    document.body.setAttribute('data-dnd-active', '')
    fireKeydown('ArrowUp')
    expect(handler).not.toHaveBeenCalled()
    document.body.removeAttribute('data-dnd-active')
  })

  it('fires again after data-dnd-active is removed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts([{ key: 'ArrowUp', handler }]))
    document.body.setAttribute('data-dnd-active', '')
    fireKeydown('ArrowUp')
    document.body.removeAttribute('data-dnd-active')
    fireKeydown('ArrowUp')
    expect(handler).toHaveBeenCalledOnce()
  })
})
