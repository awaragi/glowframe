## 1. shadcn/ui Component Installation

- [x] 1.1 Add Sheet component via `npx shadcn@latest add sheet`
- [x] 1.2 Add Slider component via `npx shadcn@latest add slider`
- [x] 1.3 Add Select component via `npx shadcn@latest add select`
- [x] 1.4 Add Input component via `npx shadcn@latest add input` (if not already present)
- [x] 1.5 Add Label component via `npx shadcn@latest add label` (if not already present)

## 2. GearButton Component

- [x] 2.1 Create `src/components/GearButton.tsx` — a shadcn/ui `Button` (variant `ghost`/`icon`) with a Lucide `Settings2` icon, `aria-label="Open settings"`, fixed `top-4 right-4 z-50` positioning
- [x] 2.2 The button accepts an `onClick` prop to open the settings sheet

## 3. SettingsModal Component

- [x] 3.1 Create `src/components/SettingsModal.tsx` — shadcn/ui `Sheet` with `side="right"` and `bg-background/90 backdrop-blur-sm` styling
- [x] 3.2 Define Zod schema for the profile form fields: `name`, `lightColor`, `brightness`, `colorTemperature`, `ringFormat`, `innerRadius`, `outerRadius`
- [x] 3.3 Initialise React Hook Form with `zodResolver` and `defaultValues` from the active Zustand profile; `mode: "onChange"`
- [x] 3.4 Add `useEffect` to call `form.reset(activeProfile)` when `activeProfileId` changes
- [x] 3.5 Wire each control's `onChange` to call `updateProfile(activeProfileId, { field: value })` for live updates

## 4. Profile Management UI (inside SettingsModal)

- [x] 4.1 Render a scrollable list of profile names; highlight the active profile
- [x] 4.2 Add click handler on each list item to call `setActiveProfile(id)`
- [x] 4.3 Add an inline rename `Input` for the active profile name, wired to `renameProfile`
- [x] 4.4 Add a "New profile" `Button` that calls `createProfile("New Profile")`
- [x] 4.5 Add a delete `IconButton` per profile row, calling `deleteProfile(id)`; disable when only one profile exists

## 5. Parameter Controls (inside SettingsModal)

- [x] 5.1 Add `<input type="color">` for `lightColor`, wired to RHF + `updateProfile`
- [x] 5.2 Add shadcn/ui `Slider` for `colorTemperature` (min=1000, max=10000, step=100)
- [x] 5.3 Add shadcn/ui `Slider` for `brightness` (min=0, max=100, step=1)
- [x] 5.4 Add shadcn/ui `Select` for `ringFormat` with options `full`, `circle`, `border`
- [x] 5.5 Conditionally render `innerRadius` Slider (min=0, max=100) when `ringFormat !== "full"`
- [x] 5.6 Conditionally render `outerRadius` Slider (min=0, max=100) when `ringFormat !== "full"`

## 6. LightPage Integration

- [x] 6.1 Update `src/pages/LightPage.tsx` to manage `isSettingsOpen` state (local `useState`)
- [x] 6.2 Mount `GearButton` with `onClick={() => setIsSettingsOpen(true)}`
- [x] 6.3 Mount `SettingsModal` with `open={isSettingsOpen}` and `onOpenChange={setIsSettingsOpen}`

## 7. Unit Tests

- [x] 7.1 Create `src/components/SettingsModal.test.tsx` — test modal opens/closes, brightness slider dispatches `updateProfile`, ring format change shows/hides radius sliders, profile create/delete/rename calls correct actions
- [x] 7.2 Create `src/components/GearButton.test.tsx` (or co-locate) — test button renders with correct aria-label and fires onClick

## 8. E2E Tests

- [x] 8.1 Add Playwright scenario in `e2e/` for: opening settings modal via gear button, changing brightness to 50 (verify store value), creating a new profile, switching between profiles
- [x] 8.2 Run `npm run test:e2e` to confirm all E2E scenarios pass
