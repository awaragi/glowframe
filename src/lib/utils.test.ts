import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges two class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('excludes falsy values', () => {
    expect(cn('base', false && 'hidden', 'active')).toBe('base active')
  })

  it('resolves Tailwind conflicts — last utility wins', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })
})
