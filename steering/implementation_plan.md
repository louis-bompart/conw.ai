# Conway's Game of Life with GenAI - Implementation Plan

Building a highly visual, interactive "Conway's Game of Life" as a Storybook Native Experience. The simulation runs in the Storybook Preview iframe, while controls and the GenAI "Agent" interface are implemented as a custom Storybook Addon Panel.

## Current State Assessment
- pnpm workspace is set up.
- `packages/app` contains basic Vite/Storybook setup and `game.ts` core logic.
- Storybook is scaffolded but `game.stories.tsx` is an incomplete stub.
- The vanilla rendering logic resides in `packages/app/src/main.ts`.

## User Review Required
- **Architecture Validation**: We are proposing splitting into three distinct packages: `packages/engine` (Zustand state + logic), `packages/app` (Lit components + Storybook preview), and `packages/addon` (Storybook manager panel). Does this align with your vision?
- **State Management**: We will use vanilla `zustand` in the engine package to provide a framework-agnostic store that both the preview (Lit) and eventually addons can interact with via Storybook channels.

## Open Questions
- Do you want to build the Addon panel using React (Storybook's native UI framework for addons) or another framework?
- Should we overwrite your `steering/implementation_plan.md` with this refined version to maintain a single source of truth?

## Proposed Changes

### Phase 1: Complete Storybook Scaffolding
Get the current vanilla implementation fully rendering inside Storybook to establish a baseline.

#### [MODIFY] packages/app/src/stories/game.stories.tsx
- Implement a basic render function that hooks up `main.ts` logic or directly mounts the DOM elements and connects `game.ts` logic.

### Phase 2: Engine Extraction & State Management
Extract core logic into an independent package using Zustand for state broadcasts.

#### [NEW] packages/engine/package.json
- Scoped as `@conwai/engine` (or similar). Dependencies: `zustand`.

#### [NEW] packages/engine/src/store.ts
- Create a Zustand store that manages the `GameOfLife` instance, grid state, playing status, and exposes actions (`tick`, `play`, `pause`, `clear`, `toggleCell`).

#### [DELETE] packages/app/src/game.ts
- Move this logic to `packages/engine`.

#### [MODIFY] packages/app/package.json
- Add local dependency to `@conwai/engine`.

#### [MODIFY] packages/app/src/main.ts (or corresponding Story)
- Refactor to consume the Zustand store from the engine package rather than local `game.ts`.

### Phase 3: Addon Controls & Comms
Create the Storybook Addon to take over controls from the vanilla DOM.

#### [NEW] packages/addon-conway
- Scaffold a standard Storybook addon for the bottom panel.
- Implement UI buttons (Play, Pause, Tick, Clear).
- Setup Storybook Channel communication: Addon emits `CONWAY_COMMAND` events. Preview subscribes to events and dispatches them to the engine store.

### Phase 4: Componentization & Aesthetics
Replace vanilla DOM with a reactive Lit Web Component.

#### [NEW] packages/app/src/components/conway-grid.ts
- Lit Web Component `<conway-grid>`. Subscribes to the engine Zustand store to efficiently render the grid state.
- Apply modern CSS styling and micro-animations for living cells.

#### [MODIFY] packages/app/src/stories/game.stories.tsx
- Update to render the new `<conway-grid>` component instead of vanilla DOM.

### Phase 5: GenAI Integration
Integrate LLM functionality into the Addon Panel to generate life patterns.

#### [MODIFY] packages/addon-conway
- Add chat interface.
- Map LLM outputs to specific spawn patterns on the grid via Storybook channels.

## Verification Plan

### Automated Tests
- Run `vitest` for the engine package to verify Game of Life rules (under/overpopulation, reproduction).
- Storybook visual checks using `@chromatic-com/storybook`.

### Manual Verification
- Start Storybook (`npm run storybook`).
- Verify the game renders correctly in the Preview.
- Interact with the Addon panel to control the game (Play/Pause/Tick/Clear).
- Click on cells in the grid to manually toggle them.
