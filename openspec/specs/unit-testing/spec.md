# Unit Testing

## Purpose

This capability defines the unit testing requirements for the GlowFrame project, covering test coverage scripts, utility functions, state management, and UI component verification.

## Requirements

### Requirement: Coverage script exists
The project SHALL provide an `npm run test:coverage` script that runs all Vitest tests and produces a coverage report.

#### Scenario: Coverage script runs successfully
- **WHEN** a developer runs `npm run test:coverage`
- **THEN** Vitest executes all test files and outputs a coverage summary to the terminal without error

### Requirement: cn utility is tested
The `cn()` function in `src/lib/utils.ts` SHALL have unit tests covering its core merging behaviour.

#### Scenario: Merging two class strings
- **WHEN** `cn('foo', 'bar')` is called
- **THEN** the result SHALL be the string `"foo bar"`

#### Scenario: Conditional class inclusion
- **WHEN** `cn('base', false && 'hidden', 'active')` is called
- **THEN** the result SHALL be `"base active"` (falsy values excluded)

#### Scenario: Tailwind conflict resolution
- **WHEN** `cn('p-4', 'p-2')` is called
- **THEN** the result SHALL be `"p-2"` (last conflicting utility wins)

### Requirement: Store initial state is tested
`useAppStore` SHALL have unit tests verifying the initial store state.

#### Scenario: Store initialises with correct version
- **WHEN** `useAppStore.getState()` is called in a test environment
- **THEN** the returned state SHALL have `_version` equal to `1`

### Requirement: App component renders without error
The root `<App />` component SHALL render without throwing in a jsdom environment.

#### Scenario: App smoke render
- **WHEN** `<App />` is rendered via React Testing Library's `render()`
- **THEN** no error is thrown and the DOM contains at least one element

### Requirement: Button component variants are tested
The `Button` component in `src/components/ui/button.tsx` SHALL have unit tests verifying that `buttonVariants` produces the correct class output for key variant and size combinations.

#### Scenario: Default variant classes applied
- **WHEN** `buttonVariants({ variant: 'default', size: 'default' })` is called
- **THEN** the result SHALL include the `bg-primary` class

#### Scenario: Destructive variant classes applied
- **WHEN** `buttonVariants({ variant: 'destructive' })` is called
- **THEN** the result SHALL include the `bg-destructive/10` class

#### Scenario: Icon size classes applied
- **WHEN** `buttonVariants({ size: 'icon' })` is called
- **THEN** the result SHALL include the `size-8` class

#### Scenario: Custom className is merged
- **WHEN** `buttonVariants({ className: 'extra-class' })` is called
- **THEN** the result SHALL include `extra-class`

#### Scenario: Button renders with correct data-slot attribute
- **WHEN** `<Button>Click me</Button>` is rendered
- **THEN** the rendered element SHALL have `data-slot="button"`
