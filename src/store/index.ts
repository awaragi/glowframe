import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // Populated by later features (F-080 profiles, F-090 settings, etc.)
  _version: number
}

export const useAppStore = create<AppState>()(
  persist(
    () => ({
      _version: 1,
    }),
    {
      name: 'glowframe-store',
    },
  ),
)
