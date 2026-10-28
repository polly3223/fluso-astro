# Motion and Animation Reference

Sources:
- Transitions.dev: https://github.com/Jakubantalik/transitions.dev
- DotMatrix usage: https://dotmatrix.zzzzshawn.cloud/getting-started/usage

Use this reference for Fluso interface and website motion. Motion should make the product feel alive, precise, and responsive. It should not become visual noise.

## Motion Principles

- Use motion to clarify state changes, reveal structure, or make an interaction feel responsive.
- Prefer small, local transitions over large page spectacle.
- Animate compositor-friendly properties first: `transform` and `opacity`.
- Use blur sparingly and only on small elements.
- Keep interaction feedback under 200ms when possible.
- Longer transitions can be used for panels, modals, and page changes, but they should still feel fast.
- Always support `prefers-reduced-motion`.
- Avoid looping motion unless it is essential, subtle, and paused off-screen.

## Transitions.dev Patterns To Reuse

1. Card resize
   - Use when a component changes between compact and expanded states.
   - Best for cards, inspector panels, previews, and feature reveals.

2. Number pop-in
   - Use for counters, metrics, usage stats, pricing changes, and dashboard numbers.
   - Use tabular numbers for stable layout.

3. Notification badge
   - Use for status dots, unread states, alerts, and small attention cues.
   - Keep it rare so it still means something.

4. Text states swap
   - Use for button labels, loading/success states, inline status text, and tiny confirmations.
   - Good for copy like "Copy" to "Copied".

5. Menu dropdown
   - Use origin-aware scale and fade for menus.
   - The menu should visually grow from its trigger.

6. Modal open / close
   - Use opacity plus slight scale for dialogs and focused overlays.
   - Avoid dramatic zoom.

7. Panel reveal
   - Use for side panels, filters, detail drawers, command surfaces, and contextual controls.
   - Good fit for dense product UI.

8. Page side-by-side
   - Use for short internal flows, setup steps, product tours, and side-by-side state transitions.
   - Keep travel distance short.

9. Icon swap
   - Use for toggles, theme switches, play/pause, expanded/collapsed states, and tool buttons.
   - Crossfade, scale, and slight blur are enough.

## DotMatrix Direction

DotMatrix is a good fit for the Fluso identity because the brand already uses modular circular dots. Use the DotMatrix primitives directly for structured dot fields, dither-like image treatments, and animated grid effects.

DotMatrix is distributed through a custom shadcn registry. The installed components become local code, so we can rename, restyle, and retime them for Fluso rather than treating them as a black-box dependency.

Prerequisites:
- React app already running.
- Tailwind CSS configured.
- `components.json` present for shadcn CLI.
- Path aliases aligned with the project structure.

Registry entry:

```json
{
  "registries": {
    "@dotmatrix": "https://dotmatrix.zzzzshawn.cloud/r/{name}.json"
  }
}
```

Install examples:

```bash
npx shadcn@latest add @dotmatrix/dotm-square-3
npx shadcn@latest add @dotmatrix/all
```

Available loader names from the usage guide:
- `@dotmatrix/dotm-square-3`
- `@dotmatrix/dotm-circular-5`
- `@dotmatrix/dotm-triangle-2`
- `@dotmatrix/all`

If loader styles are not injected automatically, import `dotmatrix-loader.css` in the global stylesheet:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "../components/dotmatrix-loader.css";
@custom-variant dark (&:is(.dark *));
```

Inline usage pattern:

```tsx
import { DotmSquare3 } from "@/components/ui/dotm-square-3";

export function SaveButton({ isSaving }: { isSaving: boolean }) {
  return (
    <button type="button" disabled={isSaving}>
      {isSaving ? <DotmSquare3 size={18} dotSize={3} ariaLabel="Saving" /> : null}
      <span>{isSaving ? "Saving..." : "Save changes"}</span>
    </button>
  );
}
```

Use DotMatrix primitives for:
- Hero atmosphere behind product UI.
- Dither overlays on natural imagery.
- Product family backgrounds.
- Loading states based on the Fluso dot mark.
- Section transitions where dots form, dissolve, or shift density.
- Inline loaders placed close to the action they describe.

Do not use DotMatrix primitives for:
- Every background.
- Dense text areas.
- Replacing real product screenshots.
- Random decorative noise.
- Multiple competing loaders in one viewport.

## Fluso Motion Rules

- Motion should feel structured and organic: dots, panels, product surfaces, and text state changes.
- The default page should still work beautifully with all animation disabled.
- Use motion to support the visual identity:
  - Dot fields can drift, resolve, or reveal.
  - Product panels can open with restrained scale and opacity.
  - Metrics can pop in lightly.
  - Icons can swap through the modular dot language.
- Do not animate large images, full-screen blur, layout-heavy properties, or decorative blobs.

## CSS Starter

```css
:root {
  --motion-fast: 150ms;
  --motion-medium: 220ms;
  --motion-slow: 320ms;
  --motion-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}

.fluso-fade-up {
  opacity: 0;
  transform: translateY(8px);
  transition:
    opacity var(--motion-medium) var(--motion-ease-out),
    transform var(--motion-medium) var(--motion-ease-out);
}

.fluso-fade-up[data-state="open"] {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .fluso-fade-up {
    transition: none;
    transform: none;
  }
}
```

## Implementation Checklist

- Is the motion tied to a user action or meaningful state change?
- Does it avoid layout animation?
- Is there a reduced-motion fallback?
- Is the animation local rather than page-wide?
- Does it make Fluso feel more precise, calm, or alive?
