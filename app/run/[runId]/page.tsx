"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTraceQuery } from "@/hooks/useTraceQuery";
import { TraceList } from "@/components/TraceList";
import { Filters } from "@/components/Filters";
import { StepInspectorPanel } from "@/components/StepInspectorPanel";
import { getBooleanParam, getStringParam, buildSearchString } from "@/lib/url";
import { useMemo } from "react";

/**
 * Main Trace Viewer page
 */
export default function TraceViewerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const runId = params.runId as string;

  // Read filter state from URL
  const errorsOnly = getBooleanParam(searchParams, "errors", false);
  const searchQuery = getStringParam(searchParams, "q", "") || "";
  const selectedStepId = getStringParam(searchParams, "stepId");

  // Fetch trace data
  const { data, isLoading, error } = useTraceQuery(runId);

  // Filter steps based on current filters
  const filteredSteps = useMemo(() => {
    if (!data?.steps) return [];

    const filtered = data.steps;

    return filtered;
  }, [data?.steps]);

  // Calculate error count for display
  const errorCount = useMemo(() => {
    if (!data?.steps) return 0;
    return data.steps.filter((step) => step.error).length;
  }, [data?.steps]);

  // Find selected step for inspector panel
  const selectedStep = useMemo(() => {
    if (!selectedStepId || !data?.steps) return null;
    return data.steps.find((step) => step.id === selectedStepId) || null;
  }, [selectedStepId, data?.steps]);

  // Update URL with new query params
  const updateUrl = (updates: Record<string, string | boolean | null>) => {
    const newSearch = buildSearchString(searchParams, updates);
    router.replace(`/run/${runId}${newSearch}`, { scroll: false });
  };

  // Handle filter changes
  const handleErrorsOnlyChange = (value: boolean) => {
    updateUrl({ errors: value || null });
  };

  const handleSearchQueryChange = (value: string) => {
    updateUrl({ q: value || null });
  };

  const handleSelectStep = (stepId: string) => {
    updateUrl({ stepId });
  };

  const handleCloseInspector = () => {
    updateUrl({ stepId: null });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading trace data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          Error loading trace: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trace Viewer
          </h1>
          <p className="text-gray-600">Run ID: {runId}</p>
        </div>

        <div className="space-y-4">
          <Filters
            errorsOnly={errorsOnly}
            searchQuery={searchQuery}
            errorCount={errorCount}
            onErrorsOnlyChange={handleErrorsOnlyChange}
            onSearchQueryChange={handleSearchQueryChange}
          />

          <TraceList
            steps={filteredSteps}
            selectedStepId={selectedStepId}
            onSelectStep={handleSelectStep}
          />
        </div>
      </div>

      <StepInspectorPanel
        step={selectedStep}
        isOpen={!!selectedStepId}
        onClose={handleCloseInspector}
      />
    </div>
  );
}
