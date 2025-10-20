# Interview Repository Verification

## ✅ All Setup Complete

### Repository Contents
- Next.js 15 with App Router ✅
- TypeScript configured ✅
- Tailwind CSS integrated ✅
- React Query + Zod installed ✅
- All required files created ✅

### Intentional Bugs (Verified)
1. **TraceList.tsx:23** - Sorting by `id` instead of `start_time` ✅
2. **types/trace.ts:25-26** - Schema expects Date, API sends ISO strings ✅
3. **types/trace.ts:28** - Schema expects object, API sends string OR object ✅

### Feature Stubs (Verified)
- **Tier 2**: TODO comments at `page.tsx:44-45` ✅
- **Tier 3**: StepInspectorPanel needs animations ✅

### Build & Runtime
- `pnpm build` succeeds ✅
- `pnpm dev` starts successfully ✅
- Page will crash on first load (expected - Zod error) ✅

### Documentation
- README.md with clear tier descriptions ✅
- SETUP_NOTES.md for interviewer reference ✅

## Expected Candidate Flow

1. **Start**: Candidate runs `pnpm dev` and opens `/run/run_123`
2. **Tier 1a**: App crashes with Zod validation error
   - Candidate fixes schema or adds transformation
3. **Tier 1b**: App loads but steps are in wrong order
   - Candidate fixes sorting in TraceList.tsx
4. **Tier 2**: Candidate implements filter logic
   - Errors-only toggle
   - Search functionality
   - URL persistence (already wired up)
5. **Tier 3**: Candidate adds slide-out panel
   - Animations
   - URL integration polish
   - Scroll position preservation
6. **Tier 4**: Discussion about database schema

## Interview Tips
- Tier 1 should take 10-15 minutes
- Tier 2 should take 15-20 minutes
- Tier 3 is more open-ended (20+ minutes)
- Tier 4 is discussion only

Good luck with the interviews! 🎯
