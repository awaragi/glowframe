import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from './App'

describe('App', () => {
  it('renders the light surface', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )
    expect(getByTestId('light-surface')).toBeInTheDocument()
  })
})
