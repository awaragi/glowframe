import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GearButton from './GearButton'

describe('GearButton', () => {
  it('renders a button with aria-label "Open settings"', () => {
    render(<GearButton onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'Open settings' })).toBeInTheDocument()
  })

  it('fires the onClick prop when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<GearButton onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Open settings' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
