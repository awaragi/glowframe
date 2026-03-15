import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAppStore } from '@/store'
import type { Profile } from '@/store'
import SettingsModal from './SettingsModal'

function makeFullProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'profile-1',
    name: 'Default',
    mode: 'full',
    lightTemperature: 6500,
    lightBrightness: 100,
    ...overrides,
  } as Profile
}

function resetStore(profile: Profile = makeFullProfile()) {
  useAppStore.setState({
    _version: 4,
    profiles: [profile],
    activeProfileId: profile.id,
  })
  return profile
}

describe('SettingsModal', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders "Settings" title when open', () => {
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('does not render settings content when closed', () => {
    render(<SettingsModal open={false} onOpenChange={() => {}} />)
    expect(screen.queryByText('Settings')).not.toBeInTheDocument()
  })

  it('renders all profile names from the store', () => {
    const p1 = makeFullProfile({ id: 'p1', name: 'Profile A' })
    const p2 = makeFullProfile({ id: 'p2', name: 'Profile B' })
    useAppStore.setState({ profiles: [p1, p2], activeProfileId: 'p1' })
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    expect(screen.getByText('Profile A')).toBeInTheDocument()
    expect(screen.getByText('Profile B')).toBeInTheDocument()
  })

  it('clicking a profile name switches the active profile', async () => {
    const p1 = makeFullProfile({ id: 'p1', name: 'Profile A' })
    const p2 = makeFullProfile({ id: 'p2', name: 'Profile B' })
    useAppStore.setState({ profiles: [p1, p2], activeProfileId: 'p1' })
    const user = userEvent.setup()
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    await user.click(screen.getByText('Profile B'))
    expect(useAppStore.getState().activeProfileId).toBe('p2')
  })

  it('clicking "New" button calls createProfile', async () => {
    const user = userEvent.setup()
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'New profile' }))
    expect(useAppStore.getState().profiles).toHaveLength(2)
    expect(useAppStore.getState().profiles[1].name).toBe('New Profile')
  })

  it('delete button is always enabled (deleting the last profile resets to a new default)', () => {
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    expect(screen.getByRole('button', { name: /Delete/i })).toBeEnabled()
  })

  it('delete button calls deleteProfile when multiple profiles exist', async () => {
    const p1 = makeFullProfile({ id: 'p1', name: 'Profile A' })
    const p2 = makeFullProfile({ id: 'p2', name: 'Profile B' })
    useAppStore.setState({ profiles: [p1, p2], activeProfileId: 'p1' })
    const user = userEvent.setup()
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
    await user.click(deleteButtons[0])
    expect(useAppStore.getState().profiles).toHaveLength(1)
    expect(useAppStore.getState().profiles[0].id).toBe('p2')
  })

  it('renaming the profile name input updates the store on blur', async () => {
    const user = userEvent.setup()
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    const nameInput = screen.getByRole('textbox', { name: /Profile Name/i }) as HTMLInputElement
    await user.clear(nameInput)
    await user.type(nameInput, 'Studio')
    await user.tab()
    expect(useAppStore.getState().profiles[0].name).toBe('Studio')
  })

  describe('mode selector', () => {
    it('renders the mode selector trigger', () => {
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByTestId('mode-selector')).toBeInTheDocument()
    })

    it('shows the current mode in the selector', () => {
      resetStore(makeFullProfile())
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      // The trigger shows the current mode label
      expect(screen.getByTestId('mode-selector')).toHaveTextContent(/Full/i)
    })
  })

  describe('mode-specific settings sections', () => {
    it('shows Light Temperature and Light Brightness sliders in full mode', () => {
      resetStore(makeFullProfile())
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/Light Temperature/i)).toBeInTheDocument()
      expect(screen.getByText(/Light Brightness/i)).toBeInTheDocument()
    })

    it('does not show Inner Radius in full mode', () => {
      resetStore(makeFullProfile())
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.queryByText(/Inner Radius/i)).not.toBeInTheDocument()
    })

    it('shows Light Color picker in full-color mode', () => {
      resetStore({ id: 'p1', name: 'Test', mode: 'full-color', lightColor: '#ffffff' })
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByLabelText('Light color picker')).toBeInTheDocument()
    })

    it('does not show temperature or brightness sliders in full-color mode', () => {
      resetStore({ id: 'p1', name: 'Test', mode: 'full-color', lightColor: '#ffffff' })
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.queryByText(/Light Temperature/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Light Brightness/i)).not.toBeInTheDocument()
    })

    it('shows Inner Radius and Outer Radius sliders in ring mode', () => {
      resetStore({ id: 'p1', name: 'Test', mode: 'ring', lightTemperature: 6500, lightBrightness: 100, innerRadius: 20, outerRadius: 80, backgroundLightTemperature: 0, backgroundLightBrightness: 0 })
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/Inner Radius/i)).toBeInTheDocument()
      expect(screen.getByText(/Outer Radius/i)).toBeInTheDocument()
    })

    it('shows Radius slider in spot mode', () => {
      resetStore({ id: 'p1', name: 'Test', mode: 'spot', lightTemperature: 6500, lightBrightness: 100, radius: 40, backgroundLightTemperature: 0, backgroundLightBrightness: 0 })
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/\bRadius \(/i)).toBeInTheDocument()
    })

    it('shows Radius and Background Color in spot-color mode', () => {
      resetStore({ id: 'p1', name: 'Test', mode: 'spot-color', lightColor: '#ffffff', radius: 40, backgroundColor: '#000000' })
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/\bRadius \(/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Background color picker')).toBeInTheDocument()
    })
  })

  describe('switching mode', () => {
    it('calls switchMode when a new mode is selected', async () => {
      resetStore(makeFullProfile({ id: 'p1' }))
      const user = userEvent.setup()
      render(<SettingsModal open={true} onOpenChange={() => {}} />)

      // Open the mode selector
      await user.click(screen.getByTestId('mode-selector'))
      // Click "Full Color" option
      await user.click(screen.getByRole('option', { name: 'Full Color' }))

      const state = useAppStore.getState()
      const profile = state.profiles.find((p) => p.id === 'p1')!
      expect(profile.mode).toBe('full-color')
    })

    it('shows new mode fields after switching mode', async () => {
      resetStore(makeFullProfile({ id: 'p1' }))
      const user = userEvent.setup()
      render(<SettingsModal open={true} onOpenChange={() => {}} />)

      await user.click(screen.getByTestId('mode-selector'))
      await user.click(screen.getByRole('option', { name: 'Full Color' }))

      // Should now show Light Color picker, not temperature/brightness sliders
      expect(screen.queryByText(/Light Temperature/i)).not.toBeInTheDocument()
      expect(screen.getByLabelText('Light color picker')).toBeInTheDocument()
    })
  })
})
