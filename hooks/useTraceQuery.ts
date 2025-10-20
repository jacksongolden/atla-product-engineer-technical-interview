import { useQuery } from "@tanstack/react-query";
import { TraceResponseSchema, type TraceResponse } from "@/types/trace";

/**
 * Hook to fetch and parse trace data
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
      const parsed = TraceResponseSchema.parse(data);

      return parsed;
    },
  });
}
