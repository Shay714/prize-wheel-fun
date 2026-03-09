

# Implementation Plan: Private Winner Wheel Free

The plan was approved previously but not yet implemented. All files need to be created.

## Files to Create

1. **`src/hooks/useContestants.ts`** — Custom hook for contestant CRUD with localStorage sync, 20-contestant limit, sample data on first load
2. **`src/hooks/useTheme.ts`** — Dark/light mode toggle with localStorage persistence
3. **`src/lib/confetti.ts`** — Lightweight confetti animation utility (canvas-based)
4. **`src/lib/wheelColors.ts`** — Array of bright segment colors
5. **`src/components/ContestantForm.tsx`** — Add/edit form with wide name + email inputs
6. **`src/components/BulkPaste.tsx`** — Collapsible textarea for pasting "Name, Email" lines
7. **`src/components/ContestantList.tsx`** — Card list with edit/delete, shuffle, clear all
8. **`src/components/SpinWheel.tsx`** — Canvas wheel with spin animation (easing slowdown, random winner)
9. **`src/components/WinnerModal.tsx`** — Dialog showing winner name + email with confetti
10. **`src/components/ThemeToggle.tsx`** — Sun/moon icon button
11. **`src/pages/Index.tsx`** — Main layout assembling all sections

## Updates
- **`src/index.css`** — Add CSS variables for bright color palette, dark mode support
- **`tailwind.config.ts`** — Add custom animations (spin-wheel, confetti)

## Key Technical Decisions
- Canvas-based wheel (no external library) with `requestAnimationFrame` for smooth spin
- Easing function: deceleration curve `t * (2 - t)` for natural slowdown
- Confetti: ~50 lightweight CSS-animated particles spawned on winner selection
- All state in localStorage via custom hooks with `useState` + `useEffect` sync

