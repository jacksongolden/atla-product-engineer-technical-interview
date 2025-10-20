# Trace Viewer - Interviewer Guide

50-minute coding interview for Next.js/TypeScript position.

## Structure

- **Tier 1** (5-10 min): Debug sorting bug
- **Tier 2** (15-20 min): Implement filters with debouncing
- **Tier 3** (15-20 min): Build inspector panel from scratch
- **Tier 4** (remaining): Database schema discussion

---

## Tier 1: Sorting Bug

**Issue**: Steps appear in random order (sorted by `id` instead of `start_time`)

**Location**: `components/TraceList.tsx:17`

**Fix**:

```typescript
const sortedSteps = [...steps].sort(
  (a, b) => a.start_time.getTime() - b.start_time.getTime()
);
```

**Look for**:

- Do they notice the visual bug?
- Can they locate the sorting logic quickly?

---

## Tier 2: Filtering

**Requirements**:

1. Filter by errors only
2. Search by tool name, input, or error message
3. Debounce search (300-500ms)
4. Sync with URL params

**Implementation** in `app/run/[runId]/page.tsx`:

```typescript
// Filtering
const filteredSteps = useMemo(() => {
  let result = data?.steps || [];

  if (errorsOnly) {
    result = result.filter((step) => step.error);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (step) =>
        step.tool.name.toLowerCase().includes(query) ||
        step.input?.toLowerCase().includes(query) ||
        step.error?.message.toLowerCase().includes(query)
    );
  }

  return result;
}, [data?.steps, errorsOnly, searchQuery]);

// Debouncing (option 1)
useEffect(() => {
  const timer = setTimeout(() => {
    updateUrl({ q: searchQuery || null });
  }, 300);
  return () => clearTimeout(timer);
}, [searchQuery]);
```

**Look for**:

- Correct filtering logic
- Proper debouncing with cleanup
- Understanding of URL integration

---

## Tier 3: Inspector Panel

**Requirements**: Build `components/StepInspectorPanel.tsx` from scratch

- Display step details
- Slide in from right with backdrop
- Open/close via URL param `?stepId=xxx`

**Key implementation**:

```typescript
export function StepInspectorPanel({ step, isOpen, onClose }) {
  if (!isOpen || !step) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div
        className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg z-50
                      transform transition-transform duration-300"
      >
        {/* Header, step details */}
      </div>
    </>
  );
}
```

**Integration in page**:

```typescript
const selectedStep = data?.steps.find(s => s.id === selectedStepId) || null;
<StepInspectorPanel step={selectedStep} isOpen={!!selectedStepId} onClose={...} />
```

**Look for**:

- Can they build a component from scratch?
- Understanding of CSS transitions
- Proper data flow (props, URL params)

---

## Tier 4: Schema Discussion

Design Postgres schema for step annotations (comments + tags).

**Expected topics**:

- Table design (comments table, tags table, junction table)
- Indexes (by run_id/step_id, by user_id)
- Migration strategy (feature flags, gradual rollout)
- Rollback plan

**Look for**:

- Systems thinking
- Production experience
- Clear communication

---

## Scoring

**Tier 1**: ✅ Fixed / ⚠️ Hacky / ❌ Unable
**Tier 2**: ✅ Both filters + debounce / ⚠️ Partial / ❌ Not working
**Tier 3**: ✅ Working panel + polish / ⚠️ Basic / ❌ Not attempted
**Tier 4**: ✅ Thoughtful design / ⚠️ Basic / ❌ Unclear

---

## Time Management

- **10 min**: Tier 1 done
- **25 min**: Tier 2 done
- **45 min**: Tier 3 in progress
- **50 min**: Tier 4 discussion

If stuck >15 min on Tier 1, provide hints and move on.

---
