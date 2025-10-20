import { type Step } from "@/types/trace";

/**
 * Panel to display step details
 */

interface StepInspectorPanelProps {
  step: Step | null;
  isOpen: boolean;
  onClose: () => void;
}

export function StepInspectorPanel({
  step,
  isOpen,
  onClose,
}: StepInspectorPanelProps) {
  if (!isOpen || !step) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Step Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="px-6 py-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Step</h3>
          <p className="text-gray-900">{step.step}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tool</h3>
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium">
            {getToolName(step.tool)}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Start Time</h3>
          <p className="text-gray-900 font-mono text-sm">
            {formatTime(step.start_time)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">End Time</h3>
          <p className="text-gray-900 font-mono text-sm">
            {formatTime(step.end_time)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
          <p className="text-gray-900 font-mono text-sm">
            {getDuration(step.start_time, step.end_time)}
          </p>
        </div>

        {step.input && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Input</h3>
            <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md overflow-x-auto">
              {step.input}
            </pre>
          </div>
        )}

        {step.output && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Output</h3>
            <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md overflow-x-auto">
              {step.output}
            </pre>
          </div>
        )}

        {step.error && (
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-1">Error</h3>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm font-medium text-red-900">
                {step.error.message}
              </p>
              {step.error.type && (
                <p className="text-xs text-red-600 mt-1">{step.error.type}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Step ID</h3>
          <p className="text-gray-900 font-mono text-xs">{step.id}</p>
        </div>
      </div>
    </div>
  );
}
