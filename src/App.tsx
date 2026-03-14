import { useWakeLock } from '@/hooks/useWakeLock'
import LightPage from '@/pages/LightPage'

export default function App() {
  useWakeLock()
  return <LightPage />
}
