// NOTE: This hook attaches a listener on `document`. If any future component calls
// e.stopPropagation(), shortcuts will stop working for that interaction.
import { useEffect } from 'react'

export interface KeyBinding {
  key: string
  shift?: boolean
  handler: () => void
}

export function useKeyboardShortcuts(bindings: KeyBinding[]): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      const el = document.activeElement
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLSelectElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.contentEditable === 'true')
      ) {
        return
      }

      for (const binding of bindings) {
        const keyMatch = e.key.toLowerCase() === binding.key.toLowerCase()
        const shiftRequired = binding.shift ?? false
        const shiftSatisfied = !shiftRequired || e.shiftKey
        if (keyMatch && shiftSatisfied) {
          binding.handler()
          return
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, { capture: true })
    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true })
    }
  }, [bindings])
}
