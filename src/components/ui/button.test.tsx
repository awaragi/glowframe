import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '@/components/ui/button'

describe('buttonVariants', () => {
  it('includes bg-primary for the default variant', () => {
    expect(buttonVariants({ variant: 'default', size: 'default' })).toContain('bg-primary')
  })

  it('includes bg-destructive/10 for the destructive variant', () => {
    expect(buttonVariants({ variant: 'destructive' })).toContain('bg-destructive/10')
  })

  it('includes size-8 for the icon size', () => {
    expect(buttonVariants({ size: 'icon' })).toContain('size-8')
  })

  it('merges a custom className', () => {
    expect(buttonVariants({ className: 'extra-class' })).toContain('extra-class')
  })
})

describe('Button', () => {
  it('renders with data-slot="button"', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button')
  })
})
