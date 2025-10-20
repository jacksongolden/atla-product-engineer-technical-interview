import { useQuery } from "@tanstack/react-query";
import { TraceResponseSchema, type TraceResponse } from "@/types/trace";

/**
 * Hook to fetch and parse trace data
 *
 * INTENTIONAL ISSUE: This will fail validation because of type mismatches
 * between the Zod schema and the API response. Candidates need to fix this
 * in Tier 1 by updating either the schema or adding transformation logic.
 */
export function useTraceQuery(runId: string) {
  return useQuery({
    queryKey: ["trace", runId],
    queryFn: async (): Promise<TraceResponse> => {
      const response = await fetch(`/api/runs/${runId}/trace`);

      if (!response.ok) {
        throw new Error(`Failed to fetch trace: ${response.statusText}`);
      }

      const data = await response.json();

      // This will throw validation errors due to type mismatches:
      // 1. API sends `tool` as string OR object, schema expects only object
      // 2. API sends ISO date strings, schema expects Date objects
      const parsed = TraceResponseSchema.parse(data);

      return parsed;
    },
  });
}
