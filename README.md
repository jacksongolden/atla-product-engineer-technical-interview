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

### Tier 1 — Debug (Two Small Fixes)

There are two bugs preventing the app from working correctly:

1. **Ordering Bug**: Steps are displayed in the wrong order. They should be sorted chronologically by `start_time`, but they're currently sorted by `id` (which is random).
   - **Location**: `components/TraceList.tsx`
   - **Fix**: Update the sorting logic

2. **Zod Validation Error**: The app crashes with a Zod validation error because the schema doesn't match the API response:
   - The API sometimes sends `tool` as a string (e.g., `"code"`) and sometimes as an object (e.g., `{ name: "browser" }`)
   - The API sends `start_time` and `end_time` as ISO date strings, not Date objects
   - **Locations**: `types/trace.ts` and/or `hooks/useTraceQuery.ts`
   - **Fix**: Update the schema to handle both formats, or transform the data to match the schema

### Tier 2 — Small Feature (Filters)

Implement the filtering functionality:

1. **"Errors only" toggle**: When enabled, show only steps that have an `error` field
2. **Search input**: Filter steps by matching the search query against:
   - `tool` (string or object name)
   - `input` field
   - `error.message` field
3. **URL persistence**: Both filters should be synced with URL query params:
   - `?errors=true` for the errors-only toggle
   - `?q=search+term` for the search query
   - The URL utilities in `lib/url.ts` should help with this
4. **Count display**: The error count badge is already wired up

**Files to modify**:
- `app/run/[runId]/page.tsx` (implement the filtering logic in the `filteredSteps` useMemo)

### Tier 3 — Harder Feature (Step Inspector Panel)

Implement a slide-out inspector panel that shows step details:

1. **Panel behavior**:
   - Opens when a step is selected from the list
   - Closes when the X button is clicked
   - Should slide in/out smoothly from the right side
2. **URL deep-linking**:
   - When a step is selected, add `?stepId=step_xxx` to the URL
   - When the panel is closed, remove `stepId` from the URL
   - Opening a URL with `?stepId=step_xxx` should automatically open the panel
3. **Preserve scroll position**: The list should maintain its scroll position when the panel opens/closes
4. **Visual polish**: Add smooth transitions/animations

**Files to modify**:
- `components/StepInspectorPanel.tsx` (add slide-out animation)
- `app/run/[runId]/page.tsx` (URL integration is mostly done, but you may need to adjust)

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

- Check the browser console for errors (especially Zod validation errors)
- The mock API returns ~27 steps with mixed formats
- About 20% of steps have errors
- All components use Tailwind CSS for styling

Good luck!
