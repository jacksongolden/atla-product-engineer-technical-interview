# Setup Notes - Interview Repository

## Repository Status: ✅ READY

The Trace Viewer interview repository has been successfully set up with all required components and intentional bugs.

## Quick Start for Candidates

```bash
pnpm install
pnpm dev
# Open http://localhost:3000/run/run_123
```

## Intentional Bugs/Issues (DO NOT FIX)

### Tier 1 Bugs:
1. ✅ **Sorting Bug** (`components/TraceList.tsx:21`)
   - Steps sorted by `id` instead of `start_time`
   - Line: `const sortedSteps = [...steps].sort((a, b) => a.id.localeCompare(b.id));`

2. ✅ **Zod Type Mismatch** (`types/trace.ts` + `hooks/useTraceQuery.ts`)
   - Schema expects `tool` as object only, API sends string OR object
   - Schema expects Date objects, API sends ISO strings
   - Will throw validation errors on page load

### Tier 2 Feature Stubs:
- ✅ Filters component exists but filtering logic is not implemented
- ✅ TODO comments in `app/run/[runId]/page.tsx` lines 44-45

### Tier 3 Feature Stubs:
- ✅ StepInspectorPanel exists but lacks animations
- ✅ URL integration mostly complete, needs polish

## Mock Data
- 27 steps with realistic trace data
- ~20% have errors (5 steps)
- Mixed tool formats (string and object)
- Random UUIDs, intentionally unsorted
- ISO date strings for timestamps

## File Structure
```
app/
  providers.tsx          ✅ React Query setup
  layout.tsx             ✅ Updated with Providers
  run/[runId]/page.tsx   ✅ Main coordinator (with TODOs)
  api/.../trace/route.ts ✅ Mock API with realistic data
components/
  TraceList.tsx          ✅ With sorting bug
  Filters.tsx            ✅ UI complete, logic stubbed
  StepInspectorPanel.tsx ✅ Basic structure
hooks/
  useTraceQuery.ts       ✅ With validation issues
lib/
  url.ts                 ✅ Query param helpers
types/
  trace.ts               ✅ Zod schemas with mismatches
README.md                ✅ Candidate instructions
```

## Testing Checklist
- [x] Project builds without errors (`pnpm build`)
- [x] Dev server starts successfully (`pnpm dev`)
- [x] Application will crash on initial load (Zod validation - expected)
- [x] README has clear tier descriptions
- [x] Intentional bugs are well-documented in code comments

## Next Steps for Interviewer
1. Push to private GitHub repository
2. Share with candidate
3. Candidate should see validation error on first load (Tier 1 bug)
4. After fixing Tier 1, steps will show in wrong order (Tier 1 bug)
