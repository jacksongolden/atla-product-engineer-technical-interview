# Trace Viewer — Interview Project

Welcome! This is a Next.js application for viewing AI agent execution traces. Your task is to fix bugs and implement features across multiple tiers.

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   ```

3. Open [http://localhost:3000/run/run_123](http://localhost:3000/run/run_123) in your browser.

## Project Structure

```
app/
  providers.tsx          - React Query provider
  layout.tsx             - Root layout
  run/[runId]/page.tsx   - Main trace viewer page
  api/runs/[runId]/trace/route.ts - Mock API endpoint
components/
  TraceList.tsx          - Step list component
  Filters.tsx            - Filter controls
  StepInspectorPanel.tsx - Step details panel
hooks/
  useTraceQuery.ts       - Data fetching hook
lib/
  url.ts                 - URL query parameter utilities
types/
  trace.ts               - Zod schemas and types
```

## Your Tasks

### Tier 1 — Debug (One Bug)

There is a visual bug in the application:

**Ordering Bug**: Steps are displayed in the wrong order. They should be sorted chronologically by `start_time`, but they're currently sorted by `id` (which is random).
- **Location**: `components/TraceList.tsx`
- **Fix**: Update the sorting logic to sort by timestamp instead

### Tier 2 — Small Feature (Filters)

Implement the filtering functionality:

1. **"Errors only" toggle**: When enabled, show only steps that have an `error` field
2. **Search input**: Filter steps by matching the search query against:
   - `tool.name` field (tool is an object with a `name` property)
   - `input` field
   - `error.message` field (if error exists)
3. **Debouncing**: The search input should be debounced (300-500ms) to avoid excessive URL updates while typing
4. **URL persistence**: Both filters should be synced with URL query params:
   - `?errors=true` for the errors-only toggle
   - `?q=search+term` for the search query
   - The URL utilities in `lib/url.ts` should help with this
5. **Count display**: The error count badge is already wired up

**Files to modify**:
- `app/run/[runId]/page.tsx` (implement the filtering logic in the `filteredSteps` useMemo and add debouncing)

### Tier 3 — Harder Feature (Step Inspector Panel)

**Build a slide-out inspector panel from scratch** that shows step details:

1. **Create the component**:
   - Create a new file `components/StepInspectorPanel.tsx`
   - Display step details: name, tool, timestamps, input, output, and errors (if any)
   - Include a close button

2. **Panel behavior**:
   - Opens when a step is selected from the list (row click already sets `?stepId=step_xxx`)
   - Closes when the X button is clicked
   - Should slide in/out smoothly from the right side
   - Add a backdrop/overlay

3. **URL deep-linking**:
   - Read `selectedStepId` from URL params (already done in main page)
   - Panel opens when `stepId` is present in the URL
   - Closing the panel removes `stepId` from the URL
   - Direct navigation to URLs like `/run/run_123?stepId=step_xxx` should work

4. **Integration**:
   - Import and use the component in `app/run/[runId]/page.tsx`
   - Find the selected step from `data.steps` by matching the `selectedStepId`
   - Pass the step data and handlers to your panel component

5. **Visual polish**:
   - Smooth transitions/animations
   - Preserve list scroll position when opening/closing
   - Close on backdrop click

**Files to create/modify**:
- `components/StepInspectorPanel.tsx` (create this new component)
- `app/run/[runId]/page.tsx` (integrate the panel)

### Tier 4 — Planning (Discussion)

**No code required** — just be ready to discuss:

Design a Postgres schema to support **per-step annotations** (comments and tags):
- Users should be able to add comments to any step
- Users should be able to tag steps with custom labels
- Consider:
  - Table design and relationships
  - Indexes for performance
  - Migration strategy for rolling this out to production
  - Rollback plan if something goes wrong

## Notes

- **No tests required** — focus on correctness, code clarity, and UX
- **No virtualization needed** — the mock data is small enough
- Feel free to ask questions at any time
- You can modify any file as needed
- Use the browser's dev tools to debug issues

## Tips

- The mock API returns ~27 steps
- About 20% of steps have errors
- All components use Tailwind CSS for styling
- The app should load successfully on first run, but steps will be in the wrong order
- Use browser dev tools to inspect the data and understand the structure

Good luck!
