import { useState } from 'react'
import LightSurface from '@/components/LightSurface'
import GearButton from '@/components/GearButton'
import SettingsModal from '@/components/SettingsModal'

export default function LightPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <LightSurface />
      <GearButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}

