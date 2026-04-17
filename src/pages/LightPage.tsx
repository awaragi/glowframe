import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import LightSurface from '@/components/LightSurface'
import GearButton from '@/components/GearButton'
import FullscreenButton from '@/components/FullscreenButton'
import SettingsModal from '@/components/SettingsModal'
import HelpButton from '@/components/HelpButton'
import HelpDialog from '@/components/HelpDialog'
import GlobalShortcuts from '@/components/shortcuts/GlobalShortcuts'
import ActiveModeShortcuts from '@/components/shortcuts/ActiveModeShortcuts'
import ImportProfileDialog from '@/components/ImportProfileDialog'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useAppStore } from '@/store'
import { decodeProfile } from '@/lib/profileShare'
import type { SharedProfile } from '@/lib/profileShare'

export default function LightPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [pendingImport, setPendingImport] = useState<SharedProfile | null>(null)
  const { toggle } = useFullscreen()
  const profiles = useAppStore((s) => s.profiles)
  const setActiveProfile = useAppStore((s) => s.setActiveProfile)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('profile')
    if (!raw) return
    const decoded = decodeProfile(raw)
    if (decoded === null) {
      // Defer the toast until after the Toaster component has mounted and
      // subscribed to Sonner's store. In React's effect execution order,
      // LightPage's effect runs before the sibling <Toaster /> effect, so a
      // synchronous toast.error() call here would be silently dropped.
      setTimeout(() => toast.error('Invalid share link — the profile could not be imported.'), 0)
      return
    }
    setPendingImport(decoded)
  }, [])

  function handleImportConfirm() {
    history.replaceState(null, '', window.location.pathname)
    toast.success('Profile imported successfully.')
    setPendingImport(null)
  }

  function handleImportDismiss() {
    history.replaceState(null, '', window.location.pathname)
    setPendingImport(null)
  }

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
      {pendingImport && (
        <ImportProfileDialog
          profile={pendingImport}
          onImport={handleImportConfirm}
          onDismiss={handleImportDismiss}
        />
      )}
    </>
  )
}


