import { useState } from 'react'
import LightSurface from '@/components/LightSurface'
import GearButton from '@/components/GearButton'
import FullscreenButton from '@/components/FullscreenButton'
import SettingsModal from '@/components/SettingsModal'
import HelpButton from '@/components/HelpButton'
import HelpDialog from '@/components/HelpDialog'
import GlobalShortcuts from '@/components/shortcuts/GlobalShortcuts'
import ActiveModeShortcuts from '@/components/shortcuts/ActiveModeShortcuts'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store'

export default function LightPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const { toggle } = useFullscreen()
  const profiles = useAppStore((s) => s.profiles)
  const setActiveProfile = useAppStore((s) => s.setActiveProfile)

  return (
    <>
      <LightSurface />
      <GlobalShortcuts
        onToggleFullscreen={toggle}
        onToggleSettings={() => setIsSettingsOpen((v) => !v)}
        onToggleHelp={() => setIsHelpOpen((v) => !v)}
        profiles={profiles}
        setActiveProfile={setActiveProfile}
      />
      <ActiveModeShortcuts />
      <FullscreenButton />
      <HelpButton onClick={() => setIsHelpOpen(true)} />
      <GearButton onClick={() => setIsSettingsOpen(true)} />
      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <HelpDialog open={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </>
  )
}


