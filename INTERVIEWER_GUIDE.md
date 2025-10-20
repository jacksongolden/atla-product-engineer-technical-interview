# Trace Viewer - Interviewer Guide

## Overview
This is a 50-minute coding interview for a Next.js/TypeScript position. The candidate will debug issues and implement features in a trace viewer application.

## Interview Structure

### Tier 1: Debug (5-10 minutes)
One visual bug makes the trace display incorrectly.

### Tier 2: Small Feature (15-20 minutes)
Implement filtering functionality with URL persistence.

### Tier 3: Harder Feature (15-20 minutes)
Build a slide-out inspector panel with animations.

### Tier 4: Planning Discussion (remaining time)
Discuss database schema design for annotations.

---

## Tier 1: Debug Issue

### Issue: Incorrect Step Ordering

**What happens:**
The app loads successfully, but steps appear in seemingly random order instead of chronologically. The trace doesn't make logical sense when read top-to-bottom.

**Root cause:**
In `components/TraceList.tsx` line 17, steps are sorted by `id` (which are random UUIDs) instead of by `start_time`:
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
- Does the candidate notice the incorrect ordering visually?
- Do they inspect the data to understand why?
- Do they find the bug location in TraceList.tsx?
- Do they test the fix properly by checking timestamps are now sequential?

**Expected time:** 5-10 minutes

---

## Tier 2: Filtering Feature

### Requirements

Implement client-side filtering with URL persistence:

1. **"Errors only" toggle**
   - Filter to show only steps with an `error` field
   - Sync with URL param: `?errors=true`

2. **Search input**
   - Filter steps matching the query in:
     - Tool name (handle object format with `.name`)
     - Input field
     - Error message
   - Case-insensitive matching
   - **Debounce the search** (300-500ms recommended) to avoid excessive URL updates
   - Sync with URL param: `?q=search+term`

3. **Combined filters**
   - Both filters should work together
   - Clear URL params when filters are inactive

### Implementation Location

Primary location: `app/run/[runId]/page.tsx`

The `filteredSteps` useMemo (around line 39) currently returns all steps unfiltered. Implement the logic here.

### Reference Implementation

**Filtering logic:**
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
      const toolName = step.tool.name;

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

**Debouncing the search (multiple approaches possible):**
```typescript
// Option 1: useEffect + setTimeout
useEffect(() => {
  const timer = setTimeout(() => {
    updateUrl({ q: searchQuery || null });
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);

// Option 2: Custom debounce hook
// Option 3: Library like lodash.debounce or use-debounce
```

### What to look for:
- Do they understand the existing URL integration?
- Do they implement debouncing correctly?
- Do they test both filters individually and combined?
- Is the implementation performant (useMemo)?
- Does debounce cleanup properly (no memory leaks)?

---

## Tier 3: Inspector Panel

### Requirements

Build a slide-out inspector panel **from scratch** that displays step details:

1. **Component creation**
   - Create `components/StepInspectorPanel.tsx`
   - Import and use it in `app/run/[runId]/page.tsx`
   - Display step details: name, tool, timestamps, input/output, errors

2. **Slide animation**
   - Panel should slide in from the right
   - Smooth transition (300ms recommended)
   - Should overlay the content with a backdrop

3. **URL integration**
   - Row clicks already set `?stepId=step_xxx` via `handleSelectStep`
   - Panel should open when `selectedStepId` is present
   - Add close button that removes the param
   - Direct URL navigation should work (e.g., `/run/run_123?stepId=step_abc`)

4. **Data flow**
   - Read `selectedStepId` from URL (already done)
   - Find the step from `data.steps` by id
   - Pass step data to the panel

5. **Visual polish**
   - Backdrop/overlay when open
   - Proper z-index layering
   - Close on backdrop click
   - Preserve list scroll position

### Current State

No inspector panel exists. The infrastructure is ready:
- `selectedStepId` is read from URL params
- `handleSelectStep` updates URL when row is clicked
- They need to build the panel and wire it up

### Reference Implementation

**Panel component skeleton:**
```typescript
interface StepInspectorPanelProps {
  step: Step | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StepInspectorPanel({ step, isOpen, onClose }: StepInspectorPanelProps) {
  if (!isOpen || !step) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 w-96 bg-white border-l shadow-lg overflow-y-auto z-50
                      transform transition-transform duration-300 ease-in-out">
        {/* Header with close button */}
        {/* Step details */}
      </div>
    </>
  );
}
```

**Integration in main page:**
```typescript
// Find the step
const selectedStep = useMemo(() => {
  if (!selectedStepId || !data?.steps) return null;
  return data.steps.find(step => step.id === selectedStepId) || null;
}, [selectedStepId, data?.steps]);

// Close handler
const handleCloseInspector = () => {
  updateUrl({ stepId: null });
};

// Render
<StepInspectorPanel
  step={selectedStep}
  isOpen={!!selectedStepId}
  onClose={handleCloseInspector}
/>
```

### What to look for:
- Can they create a new component from scratch?
- Understanding of CSS transforms/transitions
- Proper use of Tailwind utility classes
- Data flow understanding (props, state, URL params)
- Attention to UX details (backdrop, scroll position)
- Testing edge cases (rapid open/close, invalid stepId)

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
- ✅ Bug fixed correctly (sorts by start_time)
- ⚠️ Partial fix or hacky solution
- ❌ Unable to identify or fix the bug

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

1. **Not noticing the bug visually** - Encourage them to look at the data flow
2. **Forgetting URL integration** - It's mostly wired up already for Tier 2
3. **Over-engineering Tier 3** - Simple CSS transforms are fine
4. **Tier 4 analysis paralysis** - Focus on practical design over perfection

---

## Time Management Tips

- **10 min**: Candidate should finish Tier 1 (sorting bug)
- **25 min**: Tier 2 implementation complete (filters)
- **45 min**: Tier 3 in progress or discussing Tier 4
- **50 min**: Wrap up with Tier 4 discussion if not started

If candidate is stuck on Tier 1 for >15 minutes, provide hints (e.g., "look at how the list is sorted") and move on.

---

## Setup for Interview

Before the interview:
```bash
git clone <repo-url>
cd atla-product-engineer-technical-interview
pnpm install
pnpm dev
```

Expected first behavior: **App loads successfully but steps appear in random order**

This is correct! The trace steps should look out of sequence (e.g., "Log completion" before "Initialize agent"). The candidate will need to notice and fix this.
