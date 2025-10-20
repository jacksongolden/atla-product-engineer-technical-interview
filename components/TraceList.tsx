import { type Step } from "@/types/trace";

interface TraceListProps {
  steps: Step[];
  selectedStepId?: string;
  onSelectStep: (stepId: string) => void;
}

/**
 * Displays a list of trace steps
 *
 * INTENTIONAL BUG (Tier 1):
 * Steps are sorted by `id` (random) instead of by `start_time` (chronological).
 * Candidates should fix this to sort by start_time.
 */
export function TraceList({
  steps,
  selectedStepId,
  onSelectStep,
}: TraceListProps) {
  // BUG: Sorting by id instead of start_time!
  // This will make steps appear in random order
  const sortedSteps = [...steps].sort((a, b) => a.id.localeCompare(b.id));

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    });
  };

  const getDuration = (start: Date, end: Date) => {
    const ms = end.getTime() - start.getTime();
    return `${ms}ms`;
  };

  const getToolName = (tool: Step["tool"]) => {
    if (typeof tool === "string") return tool;
    return tool.name;
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Step
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Tool
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Start Time
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Duration
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedSteps.map((step) => (
              <tr
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedStepId === step.id ? "bg-blue-50" : ""
                }`}
              >
                <td className="px-4 py-3 text-gray-900">{step.step}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                    {getToolName(step.tool)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                  {formatTime(step.start_time)}
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                  {getDuration(step.start_time, step.end_time)}
                </td>
                <td className="px-4 py-3">
                  {step.error ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                      Error
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                      Success
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
