import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAppStore } from '@/store'
import SettingsModal from './SettingsModal'

function makeProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: 'profile-1',
    name: 'Default',
    lightColor: '#ffffff',
    brightness: 80,
    colorTemperature: 6500,
    ringFormat: 'full' as const,
    innerRadius: 0,
    outerRadius: 100,
    ...overrides,
  }
}

function resetStore(profile = makeProfile()) {
  useAppStore.setState({
    _version: 3,
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
    const p1 = makeProfile({ id: 'p1', name: 'Profile A' })
    const p2 = { ...makeProfile({ id: 'p2', name: 'Profile B' }) }
    useAppStore.setState({ profiles: [p1, p2], activeProfileId: 'p1' })
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    expect(screen.getByText('Profile A')).toBeInTheDocument()
    expect(screen.getByText('Profile B')).toBeInTheDocument()
  })

  it('clicking a profile name switches the active profile', async () => {
    const p1 = makeProfile({ id: 'p1', name: 'Profile A' })
    const p2 = { ...makeProfile({ id: 'p2', name: 'Profile B' }) }
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

  it('delete button is disabled when only one profile exists', () => {
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    expect(screen.getByRole('button', { name: /Delete/i })).toBeDisabled()
  })

  it('delete button calls deleteProfile when multiple profiles exist', async () => {
    const p1 = makeProfile({ id: 'p1', name: 'Profile A' })
    const p2 = { ...makeProfile({ id: 'p2', name: 'Profile B' }) }
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

  it('changing the color input calls updateProfile with new lightColor', () => {
    render(<SettingsModal open={true} onOpenChange={() => {}} />)
    const colorInput = screen.getByLabelText('Light color picker') as HTMLInputElement
    fireEvent.change(colorInput, { target: { value: '#ff0000' } })
    expect(useAppStore.getState().profiles[0].lightColor).toBe('#ff0000')
  })

  describe('radius controls', () => {
    it('does not show radius sliders when ringFormat is "full"', () => {
      resetStore(makeProfile({ ringFormat: 'full' }))
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.queryByText(/Inner Radius/i)).not.toBeInTheDocument()
      expect(screen.queryByText(/Outer Radius/i)).not.toBeInTheDocument()
    })

    it('shows radius sliders when active profile has ringFormat "circle"', () => {
      resetStore(makeProfile({ ringFormat: 'circle' }))
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/Inner Radius/i)).toBeInTheDocument()
      expect(screen.getByText(/Outer Radius/i)).toBeInTheDocument()
    })

    it('shows radius sliders when active profile has ringFormat "border"', () => {
      resetStore(makeProfile({ ringFormat: 'border' }))
      render(<SettingsModal open={true} onOpenChange={() => {}} />)
      expect(screen.getByText(/Inner Radius/i)).toBeInTheDocument()
      expect(screen.getByText(/Outer Radius/i)).toBeInTheDocument()
    })
  })
})
