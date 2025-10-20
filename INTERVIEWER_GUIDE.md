# Trace Viewer - Interviewer Guide

## Overview
This is a 50-minute coding interview for a Next.js/TypeScript position. The candidate will debug issues and implement features in a trace viewer application.

## Interview Structure

### Tier 1: Debug (10-15 minutes)
Two bugs prevent the app from working correctly.

### Tier 2: Small Feature (15-20 minutes)
Implement filtering functionality with URL persistence.

### Tier 3: Harder Feature (15-20 minutes)
Build a slide-out inspector panel with animations.

### Tier 4: Planning Discussion (remaining time)
Discuss database schema design for annotations.

---

## Tier 1: Debug Issues

### Issue 1: Zod Validation Error

**What happens:**
The app crashes immediately on load with a Zod validation error.

**Root cause:**
The Zod schema in `types/trace.ts` doesn't match the API response format:
1. The `tool` field is typed as only accepting an object `{ name: string }`, but the API sometimes sends a plain string like `"code"` or `"browser"`
2. The `start_time` and `end_time` fields are typed as `Date` objects, but the API sends ISO date strings

**Locations:**
- Schema definition: `types/trace.ts` (lines 19-29)
- API response: `app/api/runs/[runId]/trace/route.ts` (returns mixed formats)

**Possible fixes:**
1. **Update the schema** to accept both formats:
   ```typescript
   tool: z.union([z.string(), z.object({ name: z.string() })]),
   start_time: z.string().transform(str => new Date(str)),
   end_time: z.string().transform(str => new Date(str)),
   ```

2. **Transform API data** before validation in `hooks/useTraceQuery.ts`

3. **Normalize API response** to match schema in the API route

**What to look for:**
- Does the candidate read error messages carefully?
- Do they understand Zod's type system?
- Do they consider multiple approaches?

---

### Issue 2: Incorrect Step Ordering

**What happens:**
After fixing the validation error, steps appear in seemingly random order instead of chronologically.

**Root cause:**
In `components/TraceList.tsx` line 23, steps are sorted by `id` (which are random UUIDs) instead of by `start_time`:
```typescript
const sortedSteps = [...steps].sort((a, b) => a.id.localeCompare(b.id));
```

**Fix:**
Sort by timestamp instead:
```typescript
const sortedSteps = [...steps].sort((a, b) =>
  a.start_time.getTime() - b.start_time.getTime()
);
```

**What to look for:**
- Does the candidate notice the incorrect ordering?
- Do they find the bug location quickly?
- Do they test the fix properly?

---

## Tier 2: Filtering Feature

### Requirements

Implement client-side filtering with URL persistence:

1. **"Errors only" toggle**
   - Filter to show only steps with an `error` field
   - Sync with URL param: `?errors=true`

2. **Search input**
   - Filter steps matching the query in:
     - Tool name (handle both string and object formats)
     - Input field
     - Error message
   - Case-insensitive matching
   - Sync with URL param: `?q=search+term`

3. **Combined filters**
   - Both filters should work together
   - Clear URL params when filters are inactive

### Implementation Location

Primary location: `app/run/[runId]/page.tsx`

The `filteredSteps` useMemo (around line 39) currently returns all steps unfiltered. Implement the logic here.

### Reference Implementation

```typescript
const filteredSteps = useMemo(() => {
  if (!data?.steps) return [];

  let result = data.steps;

  // Errors-only filter
  if (errorsOnly) {
    result = result.filter(step => step.error);
  }

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(step => {
      const toolName = typeof step.tool === 'string'
        ? step.tool
        : step.tool.name;

      return (
        toolName.toLowerCase().includes(query) ||
        step.input?.toLowerCase().includes(query) ||
        step.error?.message.toLowerCase().includes(query)
      );
    });
  }

  return result;
}, [data?.steps, errorsOnly, searchQuery]);
```

### What to look for:
- Do they understand the existing URL integration?
- Do they handle the mixed `tool` format correctly?
- Do they test both filters individually and combined?
- Is the implementation performant (useMemo)?

---

## Tier 3: Inspector Panel

### Requirements

Enhance `components/StepInspectorPanel.tsx` to be a proper slide-out panel:

1. **Slide animation**
   - Panel should slide in from the right
   - Smooth transition (300ms recommended)
   - Should overlay the content, not push it

2. **URL integration** (mostly complete)
   - Clicking a row adds `?stepId=step_xxx`
   - Closing removes the param
   - Direct URL navigation works

3. **Scroll preservation**
   - List scroll position maintained when panel opens/closes

4. **Visual polish**
   - Backdrop/overlay when open
   - Proper z-index layering
   - Close on backdrop click (optional)

### Current State

The component exists but renders as a simple fixed panel without transitions.

### Reference Implementation

```typescript
// Add transition classes
<div
  className={`fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200
    shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
>
  {/* content */}
</div>

// Add backdrop
{isOpen && (
  <div
    className="fixed inset-0 bg-black/20 transition-opacity"
    onClick={onClose}
  />
)}
```

### What to look for:
- Understanding of CSS transforms/transitions
- Proper use of Tailwind utility classes
- Attention to UX details
- Testing edge cases (rapid open/close, etc.)

---

## Tier 4: Database Schema Discussion

### Prompt

"Design a Postgres schema to support per-step annotations. Users should be able to:
- Add comments to any step
- Tag steps with custom labels

Consider: table design, relationships, indexes, migration strategy, and rollback plan."

### Expected Discussion Points

**Table Design:**
```sql
-- Comments table
CREATE TABLE step_comments (
  id SERIAL PRIMARY KEY,
  run_id VARCHAR(255) NOT NULL,
  step_id VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tags table (normalized)
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE step_tags (
  step_id VARCHAR(255) NOT NULL,
  tag_id INTEGER REFERENCES tags(id),
  tagged_by INTEGER NOT NULL,
  tagged_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (step_id, tag_id)
);
```

**Indexes:**
- `step_comments(run_id, step_id)` - for fetching comments
- `step_comments(user_id)` - for user activity
- `step_tags(step_id)` - for tag lookups
- `tags(name)` - already unique index

**Migration Strategy:**
- Blue-green deployment vs rolling
- Feature flags for gradual rollout
- Backwards compatibility considerations

**Rollback Plan:**
- Keep old code path available
- Database rollback scripts
- Data retention vs deletion

### What to look for:
- Systems thinking
- Understanding of tradeoffs
- Production experience
- Communication clarity

---

## Scoring Guidelines

### Tier 1 (Required)
- ✅ Both bugs fixed correctly
- ⚠️ Only one bug fixed / hacky solution
- ❌ Unable to fix bugs

### Tier 2 (Expected)
- ✅ Both filters working with URL persistence
- ⚠️ Filters work but URL not synced / incomplete
- ❌ Unable to implement filters

### Tier 3 (Nice to have)
- ✅ Smooth animations, good UX, scroll preserved
- ⚠️ Basic implementation, missing polish
- ❌ Not attempted

### Tier 4 (Discussion)
- ✅ Thoughtful schema, considers scale and operations
- ⚠️ Basic schema, limited production thinking
- ❌ Unclear or incomplete design

---

## Common Pitfalls

1. **Not reading error messages** - Zod errors are descriptive
2. **Overcomplicating Tier 1** - Simple schema updates work
3. **Forgetting URL integration** - It's mostly wired up already
4. **Over-engineering Tier 3** - Simple CSS transforms are fine
5. **Tier 4 analysis paralysis** - Focus on practical design

---

## Time Management Tips

- **15 min**: Candidate should finish Tier 1
- **30 min**: Tier 2 implementation complete
- **45 min**: Tier 3 in progress or discussing Tier 4
- **50 min**: Wrap up with Tier 4 discussion if not started

If candidate is stuck on Tier 1 for >20 minutes, provide hints and move on.

---

## Setup for Interview

Before the interview:
```bash
git clone <repo-url>
cd atla-product-engineer-technical-interview
pnpm install
pnpm dev
```

Expected first behavior: **App crashes with Zod validation error**

This is correct! The candidate will fix this.
