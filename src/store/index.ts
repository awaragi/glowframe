import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  _version: number
  lightColor: string
  brightness: number
  setLightColor: (color: string) => void
  setBrightness: (value: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      _version: 1,
      lightColor: '#ffffff',
      brightness: 100,
      setLightColor: (color) => set({ lightColor: color }),
      setBrightness: (value) => set({ brightness: value }),
    }),
    {
      name: 'glowframe-store',
      version: 1,
      partialize: (state) => ({
        lightColor: state.lightColor,
        brightness: state.brightness,
        _version: state._version,
      }),
    },
  ),
)
