import { render, act } from '@testing-library/react'
import { useAppStore } from '@/store'
import LightSurface from './LightSurface'

describe('LightSurface', () => {
  beforeEach(() => {
    useAppStore.setState({ lightColor: '#ffffff', brightness: 100 })
  })

  it('applies default white background and full brightness filter', () => {
    const { getByTestId } = render(<LightSurface />)
    const el = getByTestId('light-surface')
    expect(el).toHaveStyle({ backgroundColor: '#ffffff' })
    expect(el).toHaveStyle({ filter: 'brightness(1)' })
  })

  it('applies custom lightColor to background', () => {
    useAppStore.setState({ lightColor: '#ff0000' })
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveStyle({ backgroundColor: '#ff0000' })
  })

  it('applies reduced brightness filter', () => {
    useAppStore.setState({ brightness: 50 })
    const { getByTestId } = render(<LightSurface />)
    expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.5)' })
  })

  it('re-renders when brightness changes after mount', () => {
    const { getByTestId } = render(<LightSurface />)
    act(() => useAppStore.getState().setBrightness(50))
    expect(getByTestId('light-surface')).toHaveStyle({ filter: 'brightness(0.5)' })
  })

  it('re-renders when lightColor changes after mount', () => {
    const { getByTestId } = render(<LightSurface />)
    act(() => useAppStore.getState().setLightColor('#00ff00'))
    expect(getByTestId('light-surface')).toHaveStyle({ backgroundColor: '#00ff00' })
  })
})
